const CARTID_KEY = 'cartId'

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const cartUrl = context.config.magentoUrl + '/carts'
  const request = context.tracedRequest
  const log = context.log
  const accessToken = input.token
  const isLoggedIn = !!context.meta.userId

  let storageName = isLoggedIn ? 'user' : 'device'
  const storage = context.storage[storageName]

  storage.get(CARTID_KEY, (err, cartId) => {
    if (err) return cb(err)
    if (cartId) {
      log.debug(`using cart with id: ${cartId}`)
      return cb(null, {cartId})
    }
    createCart(request, accessToken, cartUrl, (err2, cartId) => {
      if (err2) return cb(err2)
      storage.set(CARTID_KEY, cartId, (err3) => {
        if (err3) return cb(err3)
        log.debug(`created cart with id: ${cartId}`)
        return cb(null, {cartId})
      })
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {function} cb
 */
function createCart (request, accessToken, cartUrl, cb) {
  const options = {
    url: cartUrl,
    headers: {authorization: `Bearer ${accessToken}`},
    json: {}
  }

  request('magento:createCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null, body.cartId)
  })
}
