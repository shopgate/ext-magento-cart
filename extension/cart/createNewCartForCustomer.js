const CARTID_KEY = 'cartId'
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const util = require('util')

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
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const request = context.tracedRequest('magento-cart-extension:createNewCartForCustomer', {log: true})
  const accessToken = input.token
  const cartUrl = context.config.magentoUrl + '/carts'

  if (!orderId) {
    log.error('Output key "orderId" is missing')
    return cb(new InvalidCallError())
  }

  log.debug(`Got orderId ${orderId} from app, creating new cart for customer.`)

  createCart(request, accessToken, cartUrl, log, !allowSelfSignedCertificate, (err, cartId) => {
    if (err) return cb(err)
    context.storage['user'].set(CARTID_KEY, cartId, (err) => {
      if (err) return cb(err)
      log.debug(`Created cart with id: ${cartId}`)
      return cb(null, {'success': true})
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function createCart (request, accessToken, cartUrl, log, rejectUnauthorized, cb) {
  const options = {
    url: cartUrl,
    auth: {bearer: accessToken},
    json: {},
    rejectUnauthorized
  }

  log.debug(`createNewCartForCustomer request ${util.inspect(options)}`)
  request.post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200 || !body.cartId) {
      log.error(`Got ${res.statusCode} from Magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }

    log.debug(`createNewCartForCustomer response ${util.inspect(body)}`)
    cb(null, body.cartId)
  })
}
