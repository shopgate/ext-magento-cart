const AdditionalInfo = require('../models/shopgate/cart/additionalInfo')
const Price = require('../models/shopgate/cart/price')
const Property = require('../models/shopgate/cart/property')
const Product = require('../models/shopgate/cart/product')
const AppliedDiscount = require('../models/shopgate/cart/appliedDiscount')
const CartItem = require('../models/shopgate/cart/cartItem')
const Message = require('../models/shopgate/cart/message')
const Total = require('../models/shopgate/cart/total')
const Cart = require('../models/shopgate/cart/cart')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const magentoCart = input.magentoCart
  const shopgateProducts = input.shopgateProducts
  const enableCoupons = context.config.enableCoupons

  const shopgateCart = transformToShopgateCart(magentoCart, shopgateProducts, enableCoupons)
  cb(null, {
    isOrderable: shopgateCart.isOrderable,
    isTaxIncluded: shopgateCart.isTaxIncluded,
    currency: shopgateCart.currency,
    messages: shopgateCart.messages,
    text: shopgateCart.text,
    cartItems: shopgateCart.cartItems,
    totals: shopgateCart.totals,
    enableCoupons: shopgateCart.enableCoupons || false,
    flags: shopgateCart.flags
  })
}

/**
 * @param {object} magentoCart
 * @param {[Object]} shopgateProducts
 * @param {boolean} enableCoupons
 * @returns {Cart}
 */
function transformToShopgateCart (magentoCart, shopgateProducts, enableCoupons) {
  const cartItems = getCartItems(magentoCart, shopgateProducts)
  const totals = getTotals(magentoCart)

  const cart = new Cart(cartItems, magentoCart['quote_currency_code'], totals, enableCoupons)
  // Checking if the cart has an error and set the isOrderable flag for this cart
  cart.setIsOrderable(!magentoCart.has_error)
  if (magentoCart.totals) {
    let taxTotal

    if (Array.isArray(magentoCart.totals)) {
      taxTotal = magentoCart.totals.find((element) => element.code === 'tax')
    } else {
      // TODO: remove this workaround
      taxTotal = magentoCart.totals.tax
    }

    let taxIncluded = false
    if (taxTotal) taxIncluded = parseInt(taxTotal.value) > 0

    cart.setIsTaxIncluded(taxIncluded)
  }

  return cart
}

/**
 * @param {string} magentoType
 */
function mapTotalTypes (magentoType) {
  // From Swagger (2017-11-02)
  // enum: ["subTotal", "shipping", "tax", "payment", "discount", "grandTotal"]
  switch (magentoType) {
    case 'subtotal':
      return 'subTotal'
    case 'grand_total':
      return 'grandTotal'
    default:
      return magentoType
  }
}

/**
 * @param {object} magentoCart
 */
function getTotals (magentoCart) {
  const totals = []
  for (let key in magentoCart.totals) {
    totals.push(new Total(mapTotalTypes(magentoCart.totals[key].code), magentoCart.totals[key].title, parseFloat(magentoCart.totals[key].value)))
  }
  return totals
}

/**
 * @typedef {object} magentoCartItem
 * @property {string} base_row_total
 * @property {string} price_incl_tax
 * @property {string} base_row_total_incl_tax
 *
 * @param {object} magentoCartItem
 * @param {string} cartPriceDisplaySetting
 */
function getPrice (magentoCartItem, cartPriceDisplaySetting) {
  let itemPrice = 0
  let itemBaseRowTotalPrice = 0

  // There're three possible settings for this (1,2,3), but the third one is actually not supported by GMD-Theme
  switch (cartPriceDisplaySetting) {
    case '1':
      itemPrice = parseFloat(magentoCartItem.price)
      itemBaseRowTotalPrice = parseFloat(magentoCartItem.base_row_total)
      break
    case '2':
      itemPrice = parseFloat(magentoCartItem.price_incl_tax)
      itemBaseRowTotalPrice = parseFloat(magentoCartItem.base_row_total_incl_tax)
      break
    default:
      itemPrice = parseFloat(magentoCartItem.price_incl_tax)
      itemBaseRowTotalPrice = parseFloat(magentoCartItem.base_row_total_incl_tax)
      break
  }

  // TODO: Coupon information is needed for the special price
  return new Price(itemPrice, itemBaseRowTotalPrice, null)
}

/**
 * @param {object} magentoCart
 * @param {object[]} shopgateProducts
 */
function getCartItems (magentoCart, shopgateProducts) {
  const cartItems = []
  for (let i in magentoCart.items) {
    if (magentoCart.items[i]['product_type'] === 'simple') {
      const cartItemId = magentoCart.items[i]['item_id']
      let productId = magentoCart.items[i]['product_id']
      let productName = magentoCart.items[i]['name']
      let quantity = parseInt(magentoCart.items[i]['qty'])
      let priceItem = magentoCart.items[i]

      // If it's a variant, we need to transform it into a special shopgate
      // variant id and get the quantity from the parent item
      if (magentoCart.items[i]['parent_item_id']) {
        const parentElement = magentoCart.items.find((element) => {
          return element['item_id'] === magentoCart.items[i]['parent_item_id']
        })
        productId = `${parentElement['product_id']}-${productId}`
        quantity = parentElement['qty']
        priceItem = parentElement
      }

      const shopgateProduct = shopgateProducts.find((element) => {
        return element.id === productId
      })

      const price = getPrice(priceItem, magentoCart.cart_price_display_settings)
      const product = new Product(
        productId,
        productName,
        shopgateProduct.featuredImageUrl,
        price
      )

      if (shopgateProduct.characteristics) {
        for (let j in shopgateProduct.characteristics) {
          const property = new Property('option', shopgateProduct.characteristics[j].value)
          property.setLabel(shopgateProduct.characteristics[j].name)
          product.addProperty(property)
        }
      }

      const skuInfo = new AdditionalInfo('sku', shopgateProduct.identifiers.sku)
      product.addAdditionalInfo(skuInfo)

      const cartItem = new CartItem(cartItemId, quantity, 'product', product)

      if (magentoCart.items[i]['has_error']) {
        for (let key in magentoCart.items[i]['errors']) {
          cartItem.addMessage(new Message('error', magentoCart.items[i]['errors'][key]))
        }
      }

      cartItems.push(cartItem)
    }
  }

  if (magentoCart.coupon_code !== null && magentoCart.totals.discount) {
    const amount = magentoCart.totals.discount.value
    const appliedDiscount = new AppliedDiscount(amount)
    appliedDiscount.code = magentoCart.coupon_code
    appliedDiscount.label = magentoCart.totals.discount.title
    const couponCartItem = new CartItem(magentoCart.coupon_code, 1, 'coupon', appliedDiscount)

    cartItems.push(couponCartItem)
  }

  return cartItems
}
