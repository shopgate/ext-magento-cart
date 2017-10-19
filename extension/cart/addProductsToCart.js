const util = require('util')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const log = context.log
  const accessToken = input.token
  const products = input.transformedProducts
  const cartId = input.cartId

  addProductsToCart(request, accessToken, products, cartId, cartUrl, log, (err) => {
    if (err) return cb(err)
    cb(null, {messages: null})
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {object[]} products
 * @param {integer} cartId
 * @param {string} cartUrl
 * @param {function} cb
 */
function addProductsToCart (request, accessToken, products, cartId, cartUrl, log, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/items`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: products
  }

  log.debug(`addToCart with ${util.inspect(options)}`)
  request('magento:addProductsToCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null)
  })
}
