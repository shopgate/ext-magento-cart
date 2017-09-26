const Buffer = require('buffer').Buffer
const util = require('util')

/**
 * @param {object} context
 * @param {boolean} skipStorage
 * @param {logger} log
 * @param {function} cb
 */
function getTokens (context, skipStorage, log, cb) {
  const clientCredentials = context.config.credentials
  const key = `${clientCredentials.id}-tokens`
  const storage = context.storage.extension

  getTokensFromStorage(storage, key, skipStorage, log, (err, tokens) => {
    if (err) return cb(err)
    if (!tokens) {
      log.debug('Getting tokens from cache failed, getting tokens from magento')
      return getTokensFromMagento(context.tracedRequest, clientCredentials, context.config.authUrl, log, (err, tokens) => {
        if (err) return cb(err)

        storage.set(key, tokens, (err) => {
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
 * @param {boolean} skip
 * @param {logger} log
 * @param {function} cb
 */
function getTokensFromStorage (storage, key, skip, log, cb) {
  if (skip) {
    log.debug('skipping getting tokens from cache')
    return cb(null, null)
  }
  storage.get(key, (err, tokens) => {
    if (err) return cb(err)
    cb(null, tokens)
  })
}

/**
 * @param {Request} request
 * @param {object} clientCredentials
 * @param {string} clientCredentials.id
 * @param {string} clientCredentials.secret
 * @param {string} url
 * @param {logger} log
 * @param {function} cb
 */
function getTokensFromMagento (request, clientCredentials, url, log, cb) {
  const options = {
    url: url,
    json: {
      grant_type: 'client_credentials'
    },
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientCredentials.id}:${clientCredentials.secret}`).toString('base64')}`
    }
  }

  log.debug(`Sending: ${util.inspect(options, false, 3)} to magento auth endpoint`)

  request('Magento:tokens').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode >= 400) return cb(new Error(`got error (${res.statusCode}) from magento: ${JSON.stringify(body)}`))

    if (!(Array.isArray(body.success) && body.success.length === 1 && body.success[0].access_token)) {
      cb(new Error(`received invalid response from magento: ${body}`))
    }

    const tokens = {
      // TODO: this is hopefully subject to change!!!
      accessToken: body.success[0].access_token
    }

    cb(null, tokens)
  })
}

module.exports = getTokens
