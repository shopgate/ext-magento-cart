const CARTID_KEY = 'cartId'

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const isLoggedIn = !!context.meta.userId

  let storageName = isLoggedIn ? 'user' : 'device'
  const storage = context.storage[storageName]

  storage.get(CARTID_KEY, (err, cartId) => {
    if (err) return cb(err)
    context.log.debug(`Got cartId ${cartId} from storage`)
    return cb(null, {cartId: cartId || null})
  })
}
