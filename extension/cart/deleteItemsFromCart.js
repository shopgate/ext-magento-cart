/**
 * @param {object} context
 * @param {object} input
 * @param {string} input.token
 * @param {string} input.cartId
 * @param {array} input.cartItemIds
 * @param {array} input.couponCodes
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const accessToken = input.token
  const cartId = input.cartId
  let cartItemIds = input.cartItemIds

  // We need to get couponCodes here from the pipeline call
  if ((!input.cartItemIds || input.cartItemIds.length <= 0) && (input.couponCodes && input.couponCodes.length > 0)) {
    cartItemIds = input.couponCodes
  }

  if (!input.cartId) { cb(new Error('cart id missing')) }

  deleteItemsFromCart(request, accessToken, cartId, cartItemIds, cartUrl, (err) => {
    if (err) return cb(err)
    cb(null, {})
  })
}

function deleteItemsFromCart(request, accessToken, cartId, cartItemIds, cartUrl, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/items`,
    headers: {authorization: `Bearer ${accessToken}`},
    qs: {
      cartItemIds: cartItemIds.join(',')
    },
    json: true
  }

  request('magento:deleteItemsFromCart').delete(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null)
  })
}
