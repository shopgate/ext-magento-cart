const CARTID_KEY = 'cartId'

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 *
 * @typedef {object} input
 * @property {string} orderId
 */
module.exports = function (context, input, cb) {
  const orderId = input.orderId
  const log = context.log
  const request = context.tracedRequest
  const accessToken = input.token
  const cartUrl = context.config.magentoUrl + '/carts'

  if (!orderId) {
    return cb(null, {'message': 'Input orderId was empty'})
  }

  log.debug(`Got orderId ${orderId} from app, creating new cart for customer.`)

  createCart(request, accessToken, cartUrl, (err, cartId) => {
    if (err) return cb(err)
    context.storage['user'].set(CARTID_KEY, cartId, (err) => {
      if (err) return cb(err)
      log.debug(`Created cart with id: ${cartId}`)
      return cb(null, {'success': true})
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {function} cb
 */
function createCart (request, accessToken, cartUrl, cb) {
  const options = {
    url: cartUrl,
    headers: {authorization: `Bearer ${accessToken}`},
    json: {}
  }

  request('magento:createCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null, body.cartId)
  })
}
