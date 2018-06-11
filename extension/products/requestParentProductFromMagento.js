const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @typedef {Object} RequestParentProductFromMagentoInput
 * @property {string} productId
 * @property {string} token
 */
/**
 * @param {StepContext} context
 * @param {RequestParentProductFromMagentoInput} input
 * @param {StepCallback} cb
 * @param {Error|null} cb.err
 * @param {MagentoResponseProductDetailed} cb.product
 */
module.exports = function (context, input, cb) {
  const productId = input.productId
  const accessToken = input.token
  const url = context.config.magentoUrl + '/products'
  const request = context.tracedRequest
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate

  requestParentProductFromMagento(request, productId, accessToken, url, log, !allowSelfSignedCertificate, (err, product) => {
    if (err) return cb(err)
    cb(null, {product})
  })
}

/**
 * @param {Request} request
 * @param {string} productId
 * @param {string} accessToken
 * @param {string} url
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 * @param {Error|null} cb.err
 * @param {MagentoResponseProductDetailed} cb.body
 */
function requestParentProductFromMagento (request, productId, accessToken, url, log, rejectUnauthorized, cb) {
  const options = {
    baseUrl: url,
    uri: productId,
    auth: {bearer: accessToken},
    json: true,
    rejectUnauthorized
  }

  request('Magento:parentProduct').get(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }

    return cb(null, body)
  })
}
