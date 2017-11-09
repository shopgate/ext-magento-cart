const util = require('util')

module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const log = context.log
  const accessToken = input.token
  const coupons = input.transformedCoupons
  const cartId = input.cartId

  addCouponsToCart(request, accessToken, coupons, cartId, cartUrl, log, (err) => {
    if (err) return cb(err)
    cb(null, {messages: null})
  })
}

function addCouponsToCart (request, accessToken, coupons, cartId, cartUrl, log, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/items`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: coupons
  }

  log.debug(`addCouponsToCart with ${util.inspect(options)}`)
  request('magento:addCouponsToCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null)
  })
}
