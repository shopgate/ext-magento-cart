const async = require('neo-async')

/**
 * Deletions contains an array of objects with the following structure
 * {'storage': 'device', 'key': 'token'}
 * @param {Object} context
 * @param {Object} input
 * @param {[Object]} input.deletions
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const deletions = input.deletions

  async.each(deletions, (deletion, cb) => {
    context.storage[deletion.storage].del(deletion.key, (err) => {
      if (err) return cb(err)
      cb()
    })
  }, (err) => {
    if (err) return cb(err)
    cb(null, {})
  })
}
