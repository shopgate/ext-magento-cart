const util = require('util')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const cartUrl = context.config.magentoUrl + '/carts'

  setCartCustomer(context.tracedRequest, input.token, input.cartId, cartUrl, context.log, (err) => {
    if (err) return cb(err)
    cb(null, {messages: null})
  })
}

/**
 * @typedef {Object} Request
 * @param {Request} request
 * @param {string} accessToken
 * @param {int} cartId
 * @param {string} cartUrl
 * @param {function} log
 * @param {function} cb
 */
function setCartCustomer (request, accessToken, cartId, cartUrl, log, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/customer`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: {}
  }

  log.debug(`setCartCustomer with ${util.inspect(options)}`)
  request('magento:setCartCustomer').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null)
  })
}
