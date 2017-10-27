const CartStorageHandler = require('../helpers/cartStorageHandler')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const accessToken = input.token
  const cartId = input.cartId

  getCartFromMagento(request, accessToken, cartId, cartUrl, (err, magentoCart) => {
    if (err) return cb(err)

    const csh = new CartStorageHandler(context.storage)
    csh.set(magentoCart, !!context.meta.userId, (err) => {
      if (err) return cb(err)
      cb(null, {magentoCart})
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {integer} cartId
 * @param {string} cartUrl
 * @param {function} cb
 */
function getCartFromMagento (request, accessToken, cartId, cartUrl, cb) {
  const options = {
    url: `${cartUrl}/${cartId}`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: true
  }

  request('magento:getCart').get(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    console.log('HELP', require('util').inspect(body, false, 5))

    cb(null, body)
  })
}
