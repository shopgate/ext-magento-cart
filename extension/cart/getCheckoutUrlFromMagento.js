const UtmParameters = require('../models/utmParameters/utmParameters')
const SgAppParameters = require('../models/sgAppParameters/sgAppParameters')

/**
 *
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const accessToken = input.token
  const cartId = input.cartId

  if (!input.cartId) { cb(new Error('cart id missing')) }

  getCheckoutUrlFromMagento(request, accessToken, cartId, cartUrl, (err, result) => {
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
 * @param {object} request
 * @param {string} accessToken
 * @param {string} cartId
 * @param {string} cartUrl
 * @param {function} cb
 */
function getCheckoutUrlFromMagento (request, accessToken, cartId, cartUrl, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/checkoutUrl`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: {}
  }

  request('magento:getCheckoutUrl').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }
    cb(null, body)
  })
}
