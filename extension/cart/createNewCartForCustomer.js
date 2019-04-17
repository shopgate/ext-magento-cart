const CARTID_KEY = 'cartId'
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const { error: logMageError, debug: logMageDebug } = require('../models/Logs/mage')

/**
 * @typedef {Object} CreateNewCartForCustomerInput
 * @property {string} orderId
 * @property {string} token
 * @property {Object} sgxsMeta
 */
/**
 * @param {StepContext} context
 * @param {CreateNewCartForCustomerInput} input
 * @param {StepCallback} cb
 */
module.exports = function (context, input, cb) {
  const orderId = input.orderId
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const request = context.tracedRequest('magento-cart-extension:createNewCartForCustomer', { log: true })
  const accessToken = input.token
  const cartUrl = context.config.magentoUrl + '/carts'
  const isLoggedIn = !!context.meta.userId

  if (!orderId) {
    context.log.error('Output key "orderId" is missing')
    return cb(new InvalidCallError())
  }

  context.log.debug(`Got orderId ${orderId} from app, creating new cart for customer.`)

  createCart(request, accessToken, cartUrl, context, !allowSelfSignedCertificate, (err, cartId) => {
    if (err) return cb(err)

    context.storage[isLoggedIn ? 'user' : 'device'].set(CARTID_KEY, cartId, (err) => {
      if (err) return cb(err)

      context.log.debug(`Created cart with id: ${cartId}`)

      return cb(null, { 'success': true })
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {context} context
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function createCart (request, accessToken, cartUrl, context, rejectUnauthorized, cb) {
  const options = {
    url: cartUrl,
    auth: { bearer: accessToken },
    json: {},
    rejectUnauthorized
  }

  const requestStart = new Date()
  request.post(options, (err, res) => {
    if (err) return cb(err)

    if (!res.body) {
      context.log.error(options, `Got empty body from magento. Request result: ${res}`)
      return cb(new MagentoError())
    }

    if (res.statusCode !== 200 || !res.body.cartId) {
      logMageError(context, res, ResponseParser.extractMagentoError(res.body))
      return cb(new MagentoError())
    }

    logMageDebug(context, requestStart, options, res, 'Request to Magento: createNewCartForCustomer')
    cb(null, res.body.cartId)
  })
}
