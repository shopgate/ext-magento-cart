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
  context.log.debug(`Got orderId ${orderId} from app`)
  cb()
}