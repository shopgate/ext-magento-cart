const Buffer = require('buffer').Buffer
const util = require('util')

class TokenHandler {
  // TODO: we may need all the storages since there will not just be a guest login
  constructor (credentials, authUrl, storages, log, request) {
    this.credentials = credentials
    this.authUrl = authUrl
    this.log = log
    this.storages = storages
    this.request = request
  }

  /**
   * @param {boolean} skipStorage
   * @param {function} cb
   */
  getTokens (skipStorage, cb) {
    const key = `${this.credentials.id}-tokens`
    const storage = 'extension'

    this.getTokensFromStorage(storage, key, skipStorage, (err, tokens) => {
      if (err) return cb(err)
      if (!tokens) {
        this.log.debug('Getting tokens from cache failed, getting tokens from magento')
        return this.getTokensFromMagento((err, tokens) => {
          if (err) return cb(err)

          this.storages['storage'].set(key, tokens, (err) => {
            if (err) return cb(err)
            cb(null, tokens)
          })
        })
      }
      cb(null, tokens)
    })
  }

  /**
   * @param {string} key
   * @param {string} key
   * @param {boolean} skip
   * @param {function} cb
   */
  getTokensFromStorage (storage, key, skip, cb) {
    if (skip) {
      this.log.debug('skipping getting tokens from cache')
      return cb(null, null)
    }
    this.storages[storage].get(key, (err, tokens) => {
      if (err) return cb(err)
      cb(null, tokens)
    })
  }

  /**
   * @param {function} cb
   */
  getTokensFromMagento (cb) {
    const options = {
      url: this.authUrl,
      json: {
        grant_type: 'client_credentials'
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.credentials.id}:${this.credentials.secret}`).toString('base64')}`
      }
    }

    this.log.debug(`Sending: ${util.inspect(options, false, 3)} to magento auth endpoint`)

    this.request('Magento:tokens').post(options, (err, res, body) => {
      if (err) return cb(err)
      if (res.statusCode >= 400) return cb(new Error(`got error (${res.statusCode}) from magento: ${JSON.stringify(body)}`))

      if (!(Array.isArray(body.success) && body.success.length === 1 && body.success[0].access_token)) {
        cb(new Error(`received invalid response from magento: ${body}`))
      }

      // TODO: later there will be a refresh token as well
      const tokens = {
        // TODO: this is hopefully subject to change!!!
        accessToken: body.success[0].access_token
      }

      cb(null, tokens)
    })
  }
}

module.exports = TokenHandler
