/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const accessToken = input.token
  const cartId = input.cartId
  const cartItemIds = input.cartItemIds

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
