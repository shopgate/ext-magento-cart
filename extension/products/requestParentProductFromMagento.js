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
  const request = context.tracedRequest('magento-cart-extension:requestParentProductFromMagento', {log: true})
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

  log.debug({request: options}, 'requestParentProductFromMagento request')
  const requestStart = new Date()
  request.get(options, (err, res) => {
    if (err) return cb(err)

    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from magento: ${ResponseParser.extractMagentoError(res.body)}`)
      return cb(new MagentoError())
    }

    if (!res.body) {
      log.error(options, `Got empty body from magento. Request result: ${res}`)
      return cb(new MagentoError())
    }

    log.debug({duration: new Date() - requestStart, statusCode: res.statusCode, response: res.body}, 'requestParentProductFromMagento response')
    return cb(null, res.body)
  })
}
