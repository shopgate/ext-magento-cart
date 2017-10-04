const Buffer = require('buffer').Buffer
const util = require('util')

class TokenHandler {
  constructor (credentials, authUrl, storages, log, request) {
    this.credentials = credentials
    this.authUrl = authUrl
    this.log = log
    this.storages = storages
    this.request = request
  }

  /**
   * @param {function} cb
   */
  getTokens (cb) {
    const key = `${this.credentials.id}-tokens`
    const storage = 'extension'

    this.log.debug('requesting tokens from/for magento shop plugin')
    // This will return null if the token is or is about to expire or if there is no token in the storage
    this.getTokensFromStorage(storage, key, (err, tokens) => {
      if (err) return cb(err)
      if (!tokens) {
        this.log.debug(`getting tokens from magento directly`)
        return this.getTokensFromMagento((err2, response) => {
          if (err2) return cb(err2)
          this.setTokenInStorage(storage, key, response.tokens, response.lifeSpan, (err3) => {
            if (err3) return cb(err3)
            return cb(null, response.tokens)
          })
        })
      }
      cb(null, tokens)
    })
  }

  /**
   * @param {string} storage
   * @param {string} key
   * @param {boolean} skip
   * @param {function} cb
   */
  getTokensFromStorage (storage, key, cb) {
    this.storages[storage].get(key, (err, tokenData) => {
      if (err) return cb(err)
      if (!tokenData || !tokenData.expires) return cb(null, null)
      if (tokenData.expires < (new Date()).getTime() - 60 * 1000) {
        this.log.debug('token is expired or will expire within the next minute')
        return cb(null, null)
      }

      cb(null, tokenData.tokens)
    })
  }

  /**
   * @param {string} storage
   * @param {key} key
   * @param {object} tokens
   * @param {number} expires
   * @param {function} cb
   */
  setTokenInStorage (storage, key, tokens, lifeSpan, cb) {
    const tokenData = {
      tokens: tokens,
      expires: (new Date()).getTime() + lifeSpan * 1000
    }
    this.storages[storage].set(key, tokenData, (err) => {
      if (err) return cb(err)
      cb(null)
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

    this.log.debug(`sending: ${util.inspect(options, false, 3)} to magento auth endpoint`)
    this.request('Magento:tokens').post(options, (err, res, body) => {
      if (err) return cb(err)
      if (res.statusCode >= 400) return cb(new Error(`got error (${res.statusCode}) from magento: ${JSON.stringify(body)}`))

      if (!(Array.isArray(body.success) && body.success.length === 1 && body.success[0].access_token)) {
        cb(new Error(`received invalid response from magento: ${JSON.stringify(body)}`))
      }

      const tokenData = {
        // TODO: later there will be a refresh token as well
        // TODO: this is hopefully subject to change!!!
        lifeSpan: body.success[0].expires_in,
        tokens: {
          accessToken: body.success[0].access_token
        }
      }

      cb(null, tokenData)
    })
  }
}

module.exports = TokenHandler
