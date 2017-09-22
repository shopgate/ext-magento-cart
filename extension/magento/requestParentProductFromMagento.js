const getTokens = require('./helpers/token')

/**
 * @param {object} context
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const productId = input.productId
  const url = context.config.authUrl
  const log = context.log

  getTokens(context, false, log, (err, tokens) => {
    if (err) return cb(err)

    // Try to get the product from magento
    requestParentProductFromMagento(context, productId, tokens.accessToken, url, log, (err, product) => {
      if (err) {
        // Just an expired token, no big deal, try to get a new one without the
        // "storage cache"
        if (err.message === 'dummy token expired') { // TODO: look for right error
          return getTokens(context, true, log, (err, tokens) => {
            if (err) return cb(err)

            // Try to get the product with a new access token
            requestParentProductFromMagento(context.tracedRequest, productId, tokens.accessToken, url, log, (err, product) => {
              if (err) return cb(err)
              cb(null, product)
            })
          })
        }

        // Can't be handled (may be sth. wrong with the request)
        return cb(err)
      }

      // Got product the first time
      cb(null, {product})
    })
  })
}

/**
 * @param {Request} request
 * @param {string} productId
 * @param {object} clientCredentials
 * @param {string} clientCredentials.id
 * @param {string} clientCredentials.secret
 * @param {string} accessToken
 * @param {string} url
 * @param {logger} log
 * @param {function} cb
 */
function requestParentProductFromMagento (request, productId, accessToken, url, log, cb) {
  const options = {
    url: url + `/${productId}`, // TODO: verify this is the right url
    headers: {authorization: `Bearer ${accessToken}`},
    json: true
  }

  request('Magento:parentProduct').get(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode >= 400) return cb(new Error(`Got error (${res.statusCode}) from magento: ${JSON.stringify(body)}`))
    cb(null, body)
  })
}
