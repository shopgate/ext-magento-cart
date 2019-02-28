const CartStorageHandler = require('../helpers/cartStorageHandler')
const Product = require('../models/cartUpdates/product')
const MagentoError = require('../models/Errors/MagentoEndpointError')
const ResponseParser = require('../helpers/MagentoResponseParser')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const util = require('util')

/**
 * @typedef {Object} UpdateProductsInCartInput
 * @property {(string|number)} cartId - could be 'me' or actual cart id
 * @property {string} token
 * @property {[UpdateProductsInCartInputCartItems]} cartItems
 */
/**
 * @typedef {Object} UpdateProductsInCartInputCartItems
 * @property {string} CartItemId - cart item id to modify, e.g. "15"
 * @property {number} quantity - update item to this quantity, e.g. 2
 */
/**
 * @param {StepContext} context
 * @param {UpdateProductsInCartInput} input
 * @param {StepCallback} cb
 * @param {Error|null=} cb.err
 *
 * @return {StepCallback}
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest('magento-cart-extension:updateProductsInCart', { log: true })
  const cartUrl = context.config.magentoUrl + '/carts'
  const log = context.log
  const allowSelfSignedCertificate = context.config.allowSelfSignedCertificate
  const cartItems = input.cartItems
  const accessToken = input.token
  const cartId = input.cartId

  if (!cartId) {
    log.error('Output key "cartId" is missing')
    return cb(new InvalidCallError())
  }

  const csh = new CartStorageHandler(context.storage)
  csh.get(!!context.meta.userId, (err, magentoCart) => {
    if (err) return cb(err)
    if (!magentoCart) {
      log.error('missing cart information')
      return cb(new InvalidCallError())
    }

    // check if returned guest cart matches to the one that is currently cached
    if (cartId.toString().toLowerCase() !== 'me' && String(cartId) !== String(magentoCart['entity_id'])) {
      log.error('invalid cart')
      return cb(new InvalidCallError())
    }

    let updateItems = []

    try {
      updateItems = transformToUpdateItems(cartItems, magentoCart)
    } catch (e) {
      log.error(e.message)
      return cb(new InvalidCallError())
    }

    updateProductsInCart(request, updateItems, cartId, accessToken, cartUrl, log, !allowSelfSignedCertificate, (err) => {
      if (err) return cb(err)
      cb()
    })
  })
}

/**
 * @param {Request} request
 * @param {[MagentoRequestUpdateItem]} updateItems
 * @param {(string|number)} cartId
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {Logger} log
 * @param {boolean} rejectUnauthorized
 * @param {StepCallback} cb
 */
function updateProductsInCart (request, updateItems, cartId, accessToken, cartUrl, log, rejectUnauthorized, cb) {
  const options = {
    baseUrl: cartUrl,
    uri: cartId + '/items',
    auth: { bearer: accessToken },
    json: updateItems,
    rejectUnauthorized
  }

  const requestStart = new Date()
  request.post(options, (err, res) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      log.error(`Got ${res.statusCode} from Magento: ${ResponseParser.extractMagentoError(res.body)}`)
      return cb(new MagentoError())
    }

    log.debug(
      {
        duration: new Date() - requestStart,
        statusCode: res.statusCode,
        request: util.inspect(options, true, 5),
        response: util.inspect(res.body, true, 5)
      },
      'Request to Magento: updateProductsInCart'
    )

    cb()
  })
}

/**
 * @param {MagentoResponseCart} magentoCart
 *
 * @return {[Object]}
 */
function createCartItemMap (magentoCart) {
  const cartItemMap = {}

  for (let i = 0; i < magentoCart.items.length; i++) {
    // Filter products
    if (magentoCart.items[i]['product_type'] === 'configurable' || magentoCart.items[i]['product_type'] === 'simple') {
      cartItemMap[magentoCart.items[i]['item_id']] = magentoCart.items[i]
    }
  }

  return cartItemMap
}

/**
 * @param {[UpdateProductsInCartInputCartItems]} cartItems
 * @param {MagentoResponseCart} magentoCart
 *
 * @return {Array<MagentoRequestUpdateItem>}
 * @throws {Error}
 */
function transformToUpdateItems (cartItems, magentoCart) {
  const cartItemMap = createCartItemMap(magentoCart)
  const updateItems = []
  for (let i = 0; i < cartItems.length; i++) {
    updateItems.push(transformToUpdateItem(cartItems[i], cartItemMap))
  }
  return updateItems
}

/**
 * @todo-sg: defined all error cases
 * @param {Object} cartItem contains: cartItemId and quantity
 * @param {[Object]} cartItemMap
 *
 * @return {MagentoRequestUpdateItem}
 * @throws {Error}
 */
function transformToUpdateItem (cartItem, cartItemMap) {
  const cartItemId = cartItem.cartItemId ? cartItem.cartItemId : cartItem.CartItemId
  const magentoCartItem = cartItemMap[cartItemId]
  let parentProduct = null

  if (cartItem.quantity < 0) {
    throw new Error(`cartItem ${cartItemId} has a negative quantity (${cartItem.quantity})`)
  }

  if (magentoCartItem['parent_item_id']) {
    const magentoCartItemParent = cartItemMap[magentoCartItem['parent_item_id']]
    parentProduct = new Product(magentoCartItemParent['item_id'], magentoCartItemParent['product_id'])
  }

  const product = new Product(cartItemId, magentoCartItem['product_id'], cartItem.quantity, parentProduct)

  return product.transformToUpdateProductItem()
}
