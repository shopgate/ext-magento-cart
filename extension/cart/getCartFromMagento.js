const CartStorageHandler = require('../helpers/cartStorageHandler')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const EntityNotFoundError = require('../models/Errors/EntityNotFoundError')
const EntityForbiddenError = require('../models/Errors/EntityForbiddenError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const { error: logMageError, warn: logMageWarn, debug: logMageDebug } = require('../models/Logs/mage')

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
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const cartId = input.cartId

  if (!cartId) {
    context.log.error('Output key "cartId" is missing')
    return cb(new InvalidCallError())
  }

  getCartFromMagento(request, accessToken, cartId, cartUrl, context, !allowSelfSignedCertificate, (err, magentoCart) => {
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
 * @param {context} context
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function getCartFromMagento (request, accessToken, cartId, cartUrl, context, rejectUnauthorized, cb) {
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

    switch (res.statusCode) {
      case 200:
        break
      case 403:
        logMageWarn(context, res, `${ResponseParser.extractMagentoError(res.body)}, id ${cartId.toString()}`)
        return cb(new EntityForbiddenError())
      case 404:
        logMageWarn(context, res, `${ResponseParser.extractMagentoError(res.body)}, id ${cartId.toString()}`)
        return cb(new EntityNotFoundError())
      default:
        logMageError(context, res, ResponseParser.extractMagentoError(res.body))
        return cb(new MagentoError())
    }

    if (!res.body) {
      context.log.error(options, `Got empty body from magento. Request result: ${res}`)
      return cb(new MagentoError())
    }

    logMageDebug(context, requestStart, options, res, 'Request to Magento: getCartFromMagento')
    cb(null, res.body)
  })
}
