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
      const url = context.config.productUrl
      return getTokensFromMagento(context.tracedRequest, clientCredentials, url, log, (err, tokens) => {
        if (err) return cb(err)

        storage.set(key, tokens, (err) => {
          if (err) return cb(err)
          cb(null, tokens)
        })
      })
    }
    cb(tokens)
  })
}

/**
 * @param {string} key
 * @param {boolean} skip
 * @param {logger} log
 * @param {function} cb
 */
function getTokensFromStorage (storage, key, skip, log, cb) {
  if (skip) return cb(null, null)
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
    form: {
      grant_type: 'client_credentials',
      client_id: clientCredentials.id,
      client_secret: clientCredentials.secret
    },
    json: true
  }

  request('Magento:tokens').get(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode >= 400) return cb(new Error(`Got error (${res.statusCode}) from magento: ${JSON.stringify(body)}`))

    // TODO: check if body has the right format
    cb(null, body)
  })
}

module.exports = { getTokens }
