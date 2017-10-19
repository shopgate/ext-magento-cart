/**
 *
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const accessToken = input.token
  const cartId = input.cartId

  getCheckoutUrlFromMagento(request, accessToken, cartId, cartUrl, (err, result) => {
    if (err) return cb(err)
    cb(null, {expires: result['expires_in'], url: result.url})
  })
}

function getCheckoutUrlFromMagento (request, accessToken, cartId, cartUrl, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/checkoutUrl`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: true
  }

  request('magento:getCheckoutUrl').get(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null, body)
  })
}
