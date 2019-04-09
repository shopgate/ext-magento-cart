const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const { error: logMageError, debug: logMageDebug } = require('../models/Logs/mage')

/**
 * @typedef {Object} DeleteItemsFromCartInput
 * @property {string} token
 * @property {number|string} cartId - can be cart ID for guest or "me" for customer
 * @property {[string]} cartItemIds
 * @property {[string]} couponCodes
 */
/**
 * @param {StepContext} context
 * @param {DeleteItemsFromCartInput} input
 * @param {StepCallback} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest('magento-cart-extension:deleteItemsFromCart', { log: true })
  const cartUrl = context.config.magentoUrl + '/carts'
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const accessToken = input.token
  const cartId = input.cartId
  let cartItemIds = input.cartItemIds

  if (!cartId) {
    log.error('Output key "cartId" is missing')
    return cb(new InvalidCallError())
  }

  // We need the ability to get couponCodes here from the pipeline call
  if ((!input.cartItemIds || input.cartItemIds.length <= 0) && (input.couponCodes && input.couponCodes.length > 0)) {
    cartItemIds = []
    input.couponCodes.forEach(couponCode => {
      cartItemIds.push('COUPON_' + couponCode)
    })
  }

  deleteItemsFromCart(request, accessToken, cartId, cartItemIds, cartUrl, log, !allowSelfSignedCertificate, (err) => {
    if (err) return cb(err)
    cb(null, {})
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {number|string} cartId - can be cart ID for guest or "me" for customer
 * @param {[string]} cartItemIds
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function deleteItemsFromCart (request, accessToken, cartId, cartItemIds, cartUrl, log, rejectUnauthorized, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId + '/items',
    auth: { bearer: accessToken },
    qs: {
      cartItemIds: cartItemIds.join(',')
    },
    json: true,
    rejectUnauthorized
  }

  const requestStart = new Date()
  request.delete(options, (err, res) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      logMageError(log, res, ResponseParser.extractMagentoError(res.body))
      return cb(new MagentoError())
    }

    logMageDebug(log, requestStart, options, res, 'Request to Magento: deleteItemsFromCart')
    cb()
  })
}
