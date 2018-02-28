const util = require('util')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @typedef {object} SetCartCustomer_v1Input
 * @property {number|string} cartId - can be cart ID for guest or "me" for customer
 */
/**
 * @param {StepContext} context
 * @param {object} input
 * @param {StepCallback} cb
 * @param {Error|null} cb.err
 * @param {{messages: (string|null)}} cb.result
 */
module.exports = function (context, input, cb) {
  const cartUrl = context.config.magentoUrl + '/carts'
  const cartId = input.cartId
  const log = context.log

  // cart must exist to be able to assign a customer for it
  if (!cartId) {
    // this can happen pretty regularly, as guest carts are only created if products are added
    log.debug('setCartCustomer is skipped, because no valid cartId was given')
    return cb()
  }

  assignCartCustomer(context.tracedRequest, input.token, cartId, cartUrl, log, (err) => {
    if (err) return cb(err)
    cb(null, {messages: null})
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {(number|string)} cartId - can be cart ID for guest or "me" for customer
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {StepCallback} cb
 */
function assignCartCustomer (request, accessToken, cartId, cartUrl, log, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId.toString() + '/customer',
    auth: {bearer: accessToken},
    json: {}
  }

  log.debug(`setCartCustomer with ${util.inspect(options)}`)
  request('magento:setCartCustomer').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }

    cb(null)
  })
}
