const util = require('util')
const CartStorageHandler = require('../helpers/cartStorageHandler')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @typedef {Object} getCartFromMagentoInput
 * @property {string|number} cartId - could be integer of cart ID for guest or "me" for customer
 * @property {string} token
 */
/**
 * @param {StepContext} context
 * @param {getCartFromMagentoInput} input
 * @param {StepCallback} cb
 * @param {(Error|null)} cb.err
 * @param {MagentoResponseCart} cb.magentoCart
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const accessToken = input.token
  const log = context.log
  const cartId = input.cartId

  if (!cartId) {
    return cb(new Error('Output key "cartId" is missing'))
  }

  getCartFromMagento(request, accessToken, cartId, cartUrl, log, (err, magentoCart) => {
    if (err) return cb(err)

    const csh = new CartStorageHandler(context.storage)
    csh.set(magentoCart, !!context.meta.userId, (err) => {
      if (err) return cb(err)
      cb(null, {magentoCart})
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {(string|number)} cartId - could be 'me' or cart id
 * @param {string} cartUrl - endpoint url
 * @param {Logger} log
 * @param {StepCallback} cb
 */
function getCartFromMagento (request, accessToken, cartId, cartUrl, log, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId.toString(),
    auth: {bearer: accessToken},
    json: {}
  }

  log.debug(`addItemsToCart with ${util.inspect(options)}`)
  request('magento:getCart').get(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from Magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }

    cb(null, body)
  })
}
