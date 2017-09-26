/**
 * @param {object} context
 * @param {object} input
 * @param {object} input.element
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  cb(null, input.element)
}
