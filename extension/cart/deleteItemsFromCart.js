const util = require('util')
const _ = require('underscore')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')

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
  const request = context.tracedRequest
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
    _.each(input.couponCodes, function (couponCode) {
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
    auth: {bearer: accessToken},
    qs: {
      cartItemIds: cartItemIds.join(',')
    },
    json: true,
    rejectUnauthorized
  }

  log.debug(`deleteItemsFromCart with ${util.inspect(options)}`)
  request('magento:deleteItemsFromCart').delete(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from Magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }

    cb()
  })
}
