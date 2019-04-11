const UtmParameters = require('../models/utmParameters/utmParameters')
const SgAppParameters = require('../models/sgAppParameters/sgAppParameters')
const moment = require('moment')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const { warn: logMageWarn, debug: logMageDebug } = require('../models/Logs/mage')

/**
 * @typedef {Object} getCheckoutUrlFromMagentoInput
 * @property {number|string} cartId
 * @property {string} token
 */
/**
 * @param {StepContext} context
 * @param {getCheckoutUrlFromMagentoInput} input
 *
 * @param {StepCallback} cb
 * @param {(Error|null)} cb.error
 * @param {{expires: string, url: string}} cb.result
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest('magento-cart-extension:getCheckoutUrlFromMagento', { log: true })
  const cartUrl = context.config.magentoUrl + '/carts'
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const accessToken = input.token
  const cartId = input.cartId

  if (!cartId) {
    context.log.error('Output key "cartId" is missing')
    return cb(new InvalidCallError())
  }

  getCheckoutUrlFromMagento(request, accessToken, cartId, cartUrl, context, !allowSelfSignedCertificate, (err, result) => {
    if (err) return cb(err)

    // Add additional query parameters for Google Analytics in Webcheckout
    const WebCheckoutUrlUtmParameters = new UtmParameters()
    WebCheckoutUrlUtmParameters.source = 'shopgate'
    WebCheckoutUrlUtmParameters.medium = 'app'
    WebCheckoutUrlUtmParameters.campaign = 'web-checkout'

    // Add additional query parameters for SG App call
    const WebCheckoutUrlSgAppParameters = new SgAppParameters()
    WebCheckoutUrlSgAppParameters.sgcloudInapp = 1

    const checkoutUrl = result.url + WebCheckoutUrlSgAppParameters.getQueryParameters() + WebCheckoutUrlUtmParameters.getQueryParameters()

    cb(null, { expires: moment().add(result['expires_in'], 'seconds').toISOString(), url: checkoutUrl })
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {number|string} cartId
 * @param {string} cartUrl
 * @param {context} context
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function getCheckoutUrlFromMagento (request, accessToken, cartId, cartUrl, context, rejectUnauthorized, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId + '/checkoutUrl',
    auth: { bearer: accessToken },
    json: {},
    rejectUnauthorized
  }

  const requestStart = new Date()
  request.post(options, (err, res) => {
    if (err) return cb(err)

    if (!res.body) {
      context.log.error(options, `Got empty body from magento. Request result: ${res}`)
      return cb(new MagentoError())
    }

    if (res.statusCode !== 200 || !res.body.url) {
      logMageWarn(context, res, ResponseParser.extractMagentoError(res.body))
      return cb(new MagentoError())
    }

    logMageDebug(context, requestStart, options, res, 'Request to Magento: getCheckoutUrlFromMagento')
    cb(null, res.body)
  })
}
