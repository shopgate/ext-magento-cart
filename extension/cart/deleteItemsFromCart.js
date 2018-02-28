const util = require('util')
const _ = require('underscore')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @typedef {object} DeleteItemsFromCartInput
 * @property {string} token
 * @property {number|string} cartId - can be cart ID for guest or "me" for customer
 * @property {string[]} cartItemIds
 * @property {string[]} couponCodes
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
  const accessToken = input.token
  const cartId = input.cartId
  let cartItemIds = input.cartItemIds

  // We need the ability to get couponCodes here from the pipeline call
  if ((!input.cartItemIds || input.cartItemIds.length <= 0) && (input.couponCodes && input.couponCodes.length > 0)) {
    cartItemIds = []
    _.each(input.couponCodes, function (couponCode) {
      cartItemIds.push('COUPON_' + couponCode)
    })
  }

  if (!input.cartId) {
    log.error('cart id is missing')
    cb(new Error('An internal error has occurred.'))
  }

  deleteItemsFromCart(request, accessToken, cartId, cartItemIds, cartUrl, log, (err) => {
    if (err) return cb(err)
    cb(null, {})
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {number|string} cartId - can be cart ID for guest or "me" for customer
 * @param {string[]} cartItemIds
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {StepCallback} cb
 */
function deleteItemsFromCart (request, accessToken, cartId, cartItemIds, cartUrl, log, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId + '/items',
    auth: {bearer: accessToken},
    qs: {
      cartItemIds: cartItemIds.join(',')
    },
    json: true
  }

  log.debug(`addItemsToCart with ${util.inspect(options)}`)
  request('magento:deleteItemsFromCart').delete(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from Magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }

    cb(null)
  })
}
