const util = require('util')
const errorHandler = require('../helpers/mageErrorHandler')

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
    headers: {authorization: `Bearer ${accessToken}`},
    json: items
  }

  log.debug(`addItemsToCart with ${util.inspect(options)}`)
  request('magento:addItemsToCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(errorHandler.getDescription(body)))
    }

    cb(null)
  })
}
