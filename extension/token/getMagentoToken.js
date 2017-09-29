const TokenHandler = require('../helpers/token')

/**
 * @param {object} context
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const authUrl = context.config.magentoUrl + '/auth/token'
  const credentials = context.config.credentials
  const storages = context.storage
  const request = context.tracedRequest
  const log = context.log

  const tokenHandler = new TokenHandler(credentials, authUrl, storages, log, request)

  tokenHandler.getTokens((err, tokens) => {
    if (err) return cb(err)
    return cb(null, {tokens})
  })
}
