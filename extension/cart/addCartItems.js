const MagentoError = require('../models/Errors/MagentoEndpointError')
const InvalidItemError = require('../models/Errors/InvalidItemError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const { warn: logMageWarn, debug: logMageDebug } = require('../models/Logs/mage')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest('magento-cart-extension:addCartItems', { log: true })
  const cartUrl = context.config.magentoUrl + '/carts'
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const accessToken = input.token
  const items = input.transformedItems
  const cartId = input.cartId

  addItemsToCart(request, accessToken, items, cartId, cartUrl, context, !allowSelfSignedCertificate, (err) => {
    if (err) return cb(err)
    cb(null, { messages: null })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {Object} items
 * @param {string} cartId
 * @param {string} cartUrl
 * @param {context} context
 * @param {boolean} rejectUnauthorized
 * @param {function} cb
 */
function addItemsToCart (request, accessToken, items, cartId, cartUrl, context, rejectUnauthorized, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/items`,
    auth: { bearer: accessToken },
    json: items,
    rejectUnauthorized
  }

  const requestStart = new Date()
  request.post(options, (err, res) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      logMageWarn(context, res, JSON.stringify(res.body))

      if (res.statusCode >= 400 && res.statusCode < 500) {
        return cb(ResponseParser.build(new InvalidItemError(), res.body))
      }
      return cb(new MagentoError())
    }

    logMageDebug(context, requestStart, options, res, 'Request to Magento: addCartItems')
    cb()
  })
}
