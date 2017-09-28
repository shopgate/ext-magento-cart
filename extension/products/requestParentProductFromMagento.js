const TokenHandler = require('./helpers/token')

/**
 * @param {object} context
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const productId = input.productId
  const url = context.config.productUrl
  const log = context.log

  const tokenHandler = new TokenHandler(context.config.credentials, context.config.authUrl, context.storage, log, context.tracedRequest)

  log.debug('requesting tokens for magento shop plugin')
  tokenHandler.getTokens(false, (err, tokens) => {
    if (err) return cb(err)
    log.debug(`getting product ${productId} from magento`)
    requestParentProductFromMagento(context.tracedRequest, productId, tokens.accessToken, url, log, (err2, product) => {
      if (err2) {
        // Just an expired token, no big deal, try to get a new one without the "storage cache"
        if (err2.message.startsWith('Got error (401)')) { // TODO: look for right error
          return tokenHandler.getTokens(true, (err3, tokens) => {
            if (err3) return cb(err3)
            requestParentProductFromMagento(context.tracedRequest, productId, tokens.accessToken, url, log, (err4, product2) => {
              if (err4) return cb(err4)
              return cb(null, {product: product2})
            })
          })
        } else {
          return cb(err2)
        }
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
      return cb(new Error(`Got error (${res.statusCode}) from magento: ${JSON.stringify(body)}`))
    }

    // TODO: remove regex cleanup!!!
    if (typeof body === 'string') {
      const regex = /<script.*<\/script>/g
      body = JSON.parse(body.replace(regex, ''))
    }

    cb(null, body)
  })
}
