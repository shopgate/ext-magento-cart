const util = require('util')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const cartUrl = context.config.magentoUrl + '/carts'
  const cartId = input.cartId

  // cart must exist to be able to assign a customer for it
  if (!cartId) {
    // this can happen pretty regularly, as guest carts are only created if products are added
    context.log.debug('setCartCustomer is skipped, because no valid cartId was given')
    return cb()
  }

  assignCartCustomer(context.tracedRequest, input.token, cartId, cartUrl, context.log, (err) => {
    if (err) return cb(err)
    cb(null, {messages: null})
  })
}

/**
 * @typedef {Object} Request
 * @param {Request} request
 * @param {string} accessToken
 * @param {int} cartId
 * @param {string} cartUrl
 * @param {function} log
 * @param {function} cb
 */
function assignCartCustomer (request, accessToken, cartId, cartUrl, log, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/customer`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: {}
  }

  log.debug(`setCartCustomer with ${util.inspect(options)}`)
  request('magento:setCartCustomer').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null)
  })
}
