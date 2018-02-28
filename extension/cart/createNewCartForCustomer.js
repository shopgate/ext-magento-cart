const CARTID_KEY = 'cartId'
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @typedef {object} CreateNewCartForCustomerInput
 * @property {string} orderId
 * @property {string} token
 * @property {object} sgxsMeta
 */
/**
 * @param {StepContext} context
 * @param {CreateNewCartForCustomerInput} input
 * @param {StepCallback} cb
 */
module.exports = function (context, input, cb) {
  const orderId = input.orderId
  const log = context.log
  const request = context.tracedRequest
  const accessToken = input.token
  const cartUrl = context.config.magentoUrl + '/carts'

  if (!orderId) {
    return cb(new Error('Output key "orderId" is missing'))
  }

  log.debug(`Got orderId ${orderId} from app, creating new cart for customer.`)

  createCart(request, accessToken, cartUrl, log, (err, cartId) => {
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
 * @param {StepCallback} cb
 */
function createCart (request, accessToken, cartUrl, log, cb) {
  const options = {
    url: cartUrl,
    auth: {bearer: accessToken},
    json: {}
  }

  request('magento:createCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200 || !body.cartId) {
      log.error(`Got ${res.statusCode} from Magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }

    cb(null, body.cartId)
  })
}
