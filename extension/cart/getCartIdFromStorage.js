const CARTID_KEY = 'cartId'

/**
 * @param {Object} context
 * @param {Object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const isLoggedIn = !!context.meta.userId

  // in the special case of a user being logged in, we don't need an actual cartId
  if (isLoggedIn) {
    let cartId = 'me'
    return cb(null, { cartId: cartId })
  }

  let storageName = isLoggedIn ? 'user' : 'device'
  const storage = context.storage[storageName]

  storage.get(CARTID_KEY, (err, cartId) => {
    if (err) return cb(err)
    return cb(null, { cartId: cartId || null })
  })
}
