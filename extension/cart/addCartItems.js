const util = require('util')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const InvalidItemError = require('../models/Errors/InvalidItemError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const log = context.log
  const accessToken = input.token
  const items = input.transformedItems
  const cartId = input.cartId

  addItemsToCart(request, accessToken, items, cartId, cartUrl, log, (err) => {
    if (err) return cb(err)
    cb(null, {messages: null})
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {Object} items
 * @param {string} cartId
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {function} cb
 */
function addItemsToCart (request, accessToken, items, cartId, cartUrl, log, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/items`,
    auth: {bearer: accessToken},
    json: items
  }

  log.debug(`addItemsToCart with ${util.inspect(options)}`)
  request('magento:addItemsToCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`)

      if (res.statusCode >= 400 && res.statusCode < 500) {
        return cb(ResponseParser.build(new InvalidItemError(), body))
      }
      return cb(new MagentoError())
    }

    cb()
  })
}
