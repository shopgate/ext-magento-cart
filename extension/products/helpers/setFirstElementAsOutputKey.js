/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {object} input.array
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  if (!Array.isArray(input.array) || !input.array.length) {
    return cb(new Error('first element of array not found'))
  }

  const output = {}
  output['element'] = input.array[0]

  cb(null, output)
}
