/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const productId = input.productId
  const tokens = input.tokens

  const url = context.config.magentoUrl + '/products'
  const request = context.tracedRequest
  const log = context.log

  requestParentProductFromMagento(request, productId, tokens.accessToken, url, log, (err, product) => {
    if (err) return cb(err)
    cb(null, {product})
  })
}

/**
 * @param {Request} request
 * @param {string} productId
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
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    // TODO: remove regex cleanup!!!
    if (typeof body === 'string') {
      const regex = /<script.*<\/script>/g
      body = JSON.parse(body.replace(regex, ''))
    }

    cb(null, body)
  })
}
