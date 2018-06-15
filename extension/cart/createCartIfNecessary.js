const CARTID_KEY = 'cartId'
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const util = require('util')

/**
 * @param {StepContext} context
 * @param {Object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const cartUrl = context.config.magentoUrl + '/carts'
  const request = context.tracedRequest('magento-cart-extension:createCartIfNecessary', {log: true})
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const accessToken = input.token
  const isLoggedIn = !!context.meta.userId

  // logged in users already have a cart and the id is not necessary to know, as it changes unexpectedly
  if (isLoggedIn) {
    let cartId = 'me'
    log.debug(
      `User is logged in. Using "${cartId}" as cartId instead of creating a cart and saving into the user storage.`
    )
    return cb(null, {cartId: cartId})
  }

  let storageName = isLoggedIn ? 'user' : 'device'
  const storage = context.storage[storageName]

  storage.get(CARTID_KEY, (err, cartId) => {
    if (err) return cb(err)
    if (cartId) {
      log.debug(`using cart with id: ${cartId}`)
      return cb(null, {cartId: cartId})
    }
    createCart(request, accessToken, cartUrl, log, !allowSelfSignedCertificate, (err2, cartId) => {
      if (err2) return cb(err2)
      storage.set(CARTID_KEY, cartId, (err3) => {
        if (err3) return cb(err3)
        log.debug(`created cart with id: ${cartId}`)
        return cb(null, {cartId: cartId})
      })
    })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @param {function} cb
 */
function createCart (request, accessToken, cartUrl, log, rejectUnauthorized, cb) {
  const options = {
    url: cartUrl,
    headers: {authorization: `Bearer ${accessToken}`},
    json: {},
    rejectUnauthorized
  }

  log.debug(`createCartIfNecessary request ${util.inspect(options)}`)
  request.post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }
    log.debug(`createCartIfNecessary response ${util.inspect(body)}`)
    cb(null, body.cartId)
  })
}
