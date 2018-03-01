const UtmParameters = require('../models/utmParameters/utmParameters')
const SgAppParameters = require('../models/sgAppParameters/sgAppParameters')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

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
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const log = context.log
  const accessToken = input.token
  const cartId = input.cartId

  if (!cartId) {
    return cb(new Error('Output key "cartId" is missing'))
  }

  getCheckoutUrlFromMagento(request, accessToken, cartId, cartUrl, log, (err, result) => {
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

    cb(null, {expires: result['expires_in'], url: checkoutUrl})
  })
}

/**
 * @param {Request} request
 * @param {string} accessToken
 * @param {number|string} cartId
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {StepCallback} cb
 */
function getCheckoutUrlFromMagento (request, accessToken, cartId, cartUrl, log, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId + '/checkoutUrl',
    auth: {bearer: accessToken},
    json: {}
  }

  request('magento:getCheckoutUrl').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200 || !body.url) {
      log.error(`Got ${res.statusCode} from magento: ${ResponseParser.extractMagentoError(body)}`)
      return cb(new MagentoError())
    }
    cb(null, body)
  })
}
