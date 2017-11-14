const CartStorageHandler = require('../helpers/cartStorageHandler')
const Product = require('../models/cartUpdates/product')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const request = context.tracedRequest
  const cartUrl = context.config.magentoUrl + '/carts'
  const cartItems = input.CartItem
  const accessToken = input.token
  const cartId = input.cartId

  if (!input.cartId) { cb(new Error('cart id missing')) }

  const csh = new CartStorageHandler(context.storage)
  csh.get(!!context.meta.userId, (err, magentoCart) => {
    if (err) return cb(err)
    if (!magentoCart) return cb(new Error('missing cart information'))

    // check if returned guest cart matches to the one that is currently cached
    if (cartId.toString().toLowerCase() !== 'me' && cartId !== parseInt(magentoCart['entity_id'])) {
      return cb(new Error('invalid cart'))
    }

    let updateItems = []

    try {
      updateItems = transformToUpdateItems(cartItems, magentoCart)
    } catch (e) {
      return cb(e)
    }

    updateProductsInCart(request, updateItems, cartId, accessToken, cartUrl, (err, result) => {
      if (err) return cb(err)
      cb()
    })
  })
}

/**
 * @param {object} request
 * @param {object[]} updateItems
 * @param {string} cartId
 * @param {string} accessToken
 * @param {string} cartUrl
 * @param {function} cb
 */
function updateProductsInCart (request, updateItems, cartId, accessToken, cartUrl, cb) {
  const options = {
    url: `${cartUrl}/${cartId}/items`,
    headers: {authorization: `Bearer ${accessToken}`},
    json: updateItems
  }

  request('magento:updateProductsInCart').post(options, (err, res, body) => {
    if (err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))
    }

    cb(null, body)
  })
}

/**
 *
 * @param {object} magentoCart
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
 *
 * @param {object[]} cartItems
 * @param {object} magentoCart
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
 * TODO: ERROR Cases
 * @param {object} cartItem contains: CartItemId and quantity
 * @param {object} cartItemMap
 */
function transformToUpdateItem (cartItem, cartItemMap) {
  const magentoCartItem = cartItemMap[cartItem.CartItemId]
  let parentProduct = null

  if (cartItem.quantity < 0) throw new Error(`cartItem ${cartItem.CartItemId} has a negative quantity (${cartItem.quantity})`)

  if (magentoCartItem['parent_item_id']) {
    const magentoCartItemParent = cartItemMap[magentoCartItem['parent_item_id']]
    parentProduct = new Product(magentoCartItemParent['item_id'], magentoCartItemParent['product_id'])
  }

  const product = new Product(cartItem.CartItemId, magentoCartItem['product_id'], cartItem.quantity, parentProduct)

  return product.transformToUpdateProductItem()
}
