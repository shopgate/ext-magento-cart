const CartStorageHandler = require('../helpers/cartStorageHandler')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const util = require('util')

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
  const request = context.tracedRequest('magento-cart-extension:getCartFromMagento', { log: true })
  const cartUrl = context.config.magentoUrl + '/carts'
  const accessToken = input.token
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const cartId = input.cartId

  if (!cartId) {
    log.error('Output key "cartId" is missing')
    return cb(new InvalidCallError())
  }

  getCartFromMagento(request, accessToken, cartId, cartUrl, log, !allowSelfSignedCertificate, (err, magentoCart) => {
    if (err) return cb(err)

    const csh = new CartStorageHandler(context.storage)
    csh.set(magentoCart, !!context.meta.userId, (err) => {
      if (err) return cb(err)
      cb(null, { magentoCart })
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {(string|number)} cartId - could be 'me' or cart id
 * @param {string} cartUrl - endpoint url
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function getCartFromMagento (request, accessToken, cartId, cartUrl, log, rejectUnauthorized, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId.toString(),
    auth: { bearer: accessToken },
    json: {},
    rejectUnauthorized
  }

  const requestStart = new Date()
  request.get(options, (err, res) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from Magento: ${ResponseParser.extractMagentoError(res.body)}`)
      return cb(new MagentoError())
    }
    if (!res.body) {
      log.error(options, `Got empty body from magento. Request result: ${res}`)
      return cb(new MagentoError())
    }

    log.debug(
      {
        duration: new Date() - requestStart,
        statusCode: res.statusCode,
        request: util.inspect(options, true, 5),
        response: util.inspect(res.body, true, 5)
      },
      'Request to Magento: getCartFromMagento'
    )

    cb(null, res.body)
  })
}
