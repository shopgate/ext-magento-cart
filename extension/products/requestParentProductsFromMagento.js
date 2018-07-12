const util = require('util')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')

/**
 * @typedef {Object} ShopgateProduct
 * @property {string} id
 * @typedef {string} baseProductId id of the parent item if the product is a variant
 *
 * @typedef {Object} RequestParentProductFromMagentoInput
 * @property {ShopgateProduct[]} products
 * @property {string} token
 */
/**
 * @param {StepContext} context
 * @param {RequestParentProductFromMagentoInput} input
 * @returns {promise<{magentoParentProducts: MagentoResponseProductDetailed[]}>}
 * @throws MagentoError
 */
module.exports = async (context, input) => {
  const shopgateProductList = input.products
  const accessToken = input.token
  const url = context.config.magentoUrl + '/products'
  const request = context.tracedRequest('magento-cart-extension:requestParentProductsFromMagento', {log: true})
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate

  if (!shopgateProductList) {
    return
  }

  const magentoParentProducts = await requestParentProductsFromMagento(request, shopgateProductList, accessToken, url, log, !allowSelfSignedCertificate)
  return {magentoParentProducts}
}

/**
 * Helper function to load multiple products from Magento in parallel
 *
 * @param {Request} request
 * @param {ShopgateProduct[]} shopgateProductList
 * @param {string} accessToken
 * @param {string} url
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @returns {promise<MagentoResponseProductDetailed[]>}
 * @throws MagentoError|Error
 */
async function requestParentProductsFromMagento (request, shopgateProductList, accessToken, url, log, rejectUnauthorized) {
  const parentRequestList = {}
  const mageParents = shopgateProductList.filter(p => {
    // only keep variants if not already in "parentRequestList", skip otherwise
    if (p.baseProductId && !parentRequestList[p.id]) {
      parentRequestList[p.id] = true
      return true
    }
  }).map(async p =>
    requestParentProductFromMagento(request, p.baseProductId, accessToken, url, log, rejectUnauthorized)
  )

  // resolve a bunch of parallel requests at once and return the resolved results only
  return Promise.all(mageParents)
}

/**
 * @param {Request} request
 * @param {string} productId
 * @param {string} accessToken
 * @param {string} url
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @returns {promise<MagentoResponseProductDetailed>}
 * @throws MagentoError|Error
 */
async function requestParentProductFromMagento (request, productId, accessToken, url, log, rejectUnauthorized) {
  const options = {
    baseUrl: url,
    uri: productId,
    auth: {bearer: accessToken},
    json: true,
    rejectUnauthorized
  }

  const requestStart = new Date()
  // simplify rest calls, using promises
  const sendAsyncGetRequest = util.promisify(request.get)

  let res
  try {
    res = await sendAsyncGetRequest(options)
  } catch (e) {
    log.error(e, `Failed to request products from magento`)
    throw new MagentoError()
  }

  if (res.statusCode !== 200) {
    log.error(`Got ${res.statusCode} from magento: ${ResponseParser.extractMagentoError(res.body)}`)
    throw new MagentoError()
  }

  log.debug(
    {
      duration: new Date() - requestStart,
      statusCode: res.statusCode,
      request: util.inspect(options, true, null),
      response: util.inspect(res.body, true, null)
    },
    'Request to Magento: requestParentProductsFromMagento'
  )

  return res.body
}
