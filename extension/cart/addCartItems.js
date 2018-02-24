const util = require('util')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const InvalidItemError = require('../models/Errors/InvalidItemError')
const ResponseParser = require('../helpers/MagentoResponseParser')

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
      return cb(ResponseParser.build(new MagentoError(), body))
    }

    cb(null)
  })
}
