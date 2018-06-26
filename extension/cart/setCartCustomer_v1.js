const util = require('util')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @typedef {Object} SetCartCustomer_v1Input
 * @property {number|string} cartId - can be cart ID for guest or "me" for customer
 */
/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {StepCallback} cb
 * @param {Error|null} cb.err
 * @param {{messages: (string|null)}} cb.result
 */
module.exports = function (context, input, cb) {
  const cartUrl = context.config.magentoUrl + '/carts'
  const cartId = input.cartId
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate

  // cart must exist to be able to assign a customer for it
  if (!cartId) {
    // this can happen pretty regularly, as guest carts are only created if products are added
    log.debug('setCartCustomer is skipped, because no valid cartId was given')
    return cb()
  }

  assignCartCustomer(context.tracedRequest('magento-cart-extension:setCartCustomer', {log: true}), input.token, cartId, cartUrl, log, !allowSelfSignedCertificate, (err) => {
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
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function assignCartCustomer (request, accessToken, cartId, cartUrl, log, rejectUnauthorized, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId.toString() + '/customer',
    auth: {bearer: accessToken},
    json: {},
    rejectUnauthorized
  }

  log.debug(`setCartCustomer request ${util.inspect(options)}`)
  request.post(options, (err, res) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from magento: ${ResponseParser.extractMagentoError(res.body)}`)
      return cb(new MagentoError())
    }

    log.debug(`setCartCustomer response ${util.inspect(res.body)}`)
    cb()
  })
}
