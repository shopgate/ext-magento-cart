const getTokens = require('./helpers/token')

/**
 * @param {object} context
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const productId = input.productId
  const url = context.config.productUrl
  const log = context.log

  log.debug('requesting tokens for magento shop plugin')
  getTokens(context, false, log, (err, tokens) => {
    if (err) {
      log.error(err)
      return cb(err)
    }

    log.debug(`getting product ${productId} from magento`)
    requestParentProductFromMagento(context.tracedRequest, productId, tokens.accessToken, url, log, (err, product) => {
      if (err) {
        // Just an expired token, no big deal, try to get a new one without the
        // "storage cache"
        if (err.message.startsWith('Got error (401)')) { // TODO: look for right error
          return getTokens(context, true, log, (err, tokens) => {
            if (err) return cb(err)

            requestParentProductFromMagento(context.tracedRequest, productId, tokens.accessToken, url, log, (err, product) => {
              if (err) return cb(err)
              cb(null, product)
            })
          })
        }
        return cb(err)
      }
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
    url: url + `/${productId}`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: true
  }

  request('Magento:parentProduct').get(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode >= 400) {
      // TODO: Check for unauthorized
      return cb(new Error(`Got error (${res.statusCode}) from magento: ${JSON.stringify(body)}`))
    }

    // TODO: remove regex cleanup!!!
    const regex = /<script.*<\/script>/g
    body = JSON.parse(body.replace(regex, ''))

    cb(null, body)
  })
}
