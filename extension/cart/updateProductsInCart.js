/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const cartItems = input.cartItems
  const accessToken = input.token
  const cartId = input.cartId

  if (!input.cartId) { cb(new Error('cart id missing')) }

  updateProductsInCart(request, cartItems, cartId, accessToken, cartUrl, (err, result) => {
    if (err) return cb(err)
  })
}

/**
 * @param {object} request
 * @param {object[]} cartItems
 * @param {string} cartId
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {function} cb
 */
function updateProductsInCart (request, cartItems, cartId, accessToken, cartUrl, cb) {
  // const options = {
  //   url: `${cartUrl}/${cartId}`,
  //   headers: {authorization: `Bearer ${accessToken}`},
  //   json: true
  // }

  // request('magento:updateProductsInCart').post(options, (err, res, body) => {
  //   if (err) return cb(err)
  //   if (res.statusCode !== 200) {
  //     return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
  //   }

  //   cb(null, body)
  // })
}
