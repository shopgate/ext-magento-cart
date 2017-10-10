/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const storage = context.storage.device
  const key = 'cartId'
  storage.get(key, (err, cartId) => {
    if (err) return cb(err)
    context.log.debug(`Got cartId ${cartId} from storage`)
    return cb(null, {cartId})
  })
}
