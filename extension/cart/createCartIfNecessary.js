/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const accessToken = input.tokens.accessToken

  const storage = context.storage.device
  const cartUrl = context.config.cartUrl
  const request = context.tracedRequest
  const key = 'cartId'

  storage.get(storage, key, (err, cartId) => {
    if (err) return cb(err)
    if (cartId) return cb(null, cartId)
    createCart(request, accessToken, cartUrl, (err2, cartId) => {
      if (err2) return cb(err2)
      storage.set(storage, key, cartId, (err3) => {
        if (err) return (err3)
        return cb(null, cartId)
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

}
