const CARTID_KEY = 'cartId'

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 *
 * @typedef {object} input
 * @property {string} orderId
 */
module.exports = function (context, input, cb) {
  const orderId = input.orderId
  const log = context.log

  if (!orderId) {
    return cb(null, {"message": "Input orderId was empty"})
  }

  log.debug(`Got orderId ${orderId} from app`)

  //TODO: remove cartId from user-session
  const storage = context.storage['user']

  storage.set(CARTID_KEY, null, (err) => {
    if (err) return cb(err)
    log.debug(`Set cartId to null`)
    return cb()
  })
}