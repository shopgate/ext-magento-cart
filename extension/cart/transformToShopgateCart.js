const AdditionalInfo = require('../models/shopgate/cart/additionalInfo')
const Price = require('../models/shopgate/cart/price')
const Property = require('../models/shopgate/cart/property')
const Product = require('../models/shopgate/cart/product')
const CartItem = require('../models/shopgate/cart/cartItem')
const Total = require('../models/shopgate/cart/total')
const Cart = require('../models/shopgate/cart/cart')

const util = require('util')

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

  cb(null, {cart: shopgateCart})
}

function transformToShopgateCart (magentoCart, shopgateProducts, enableCoupons) {
  const cartItems = getCartItems(magentoCart, shopgateProducts)
  const totals = getTotals(magentoCart)

  const cart = new Cart(cartItems, magentoCart['quote_currency_code'], totals, enableCoupons)
  cart.setIsOrderable(true) // isOrderable is always true in magento (if the cart exists)
  return cart
}

function getTotals (magentoCart) {
  const totals = []
  totals.push(new Total('subTotal', 'Sub Total', magentoCart['subtotal']))
  totals.push(new Total('grandTotal', 'Total', magentoCart['grand_total']))

  return totals
}

function getCartItems (magentoCart, shopgateProducts) {
  const cartItems = []

  for (let i in magentoCart.items) {
    if (magentoCart.items[i]['product_type'] === 'simple') {
      const cartItemId = magentoCart.items[i]['item_id']
      let productId = magentoCart.items[i]['product_id']
      let productName = magentoCart.items[i]['name']
      let quantity = parseInt(magentoCart.items[i]['qty'])
      const itemPrice = parseInt(magentoCart.items[i]['price']) // Check if that's the price

      // If it's a variant, we need to transform it into a special shopgate
      // variant id
      if (magentoCart.items[i]['parent_item_id']) {
        const parentElement = magentoCart.items.find((element) => {
          return element['item_id'] === magentoCart.items[i]['parent_item_id']
        })
        productId = `${parentElement['product_id']}-${productId}`
        quantity = parentElement['qty']
      }

      const shopgateProduct = shopgateProducts.find((element) => {
        return element.id === productId
      })

      // TODO: Coupon information is needed for the special price
      const price = new Price(itemPrice, itemPrice * quantity, itemPrice * quantity)

      const product = new Product(productId, productName, shopgateProduct.featuredImageUrl, price)
      if (shopgateProduct.characteristics) {
        for (let j in shopgateProduct.characteristics) {
          // TODO: Check if this is correct
          const property = new Property('option', shopgateProduct.characteristics[j].value)
          property.setLabel(shopgateProduct.characteristics[j].name)
          product.addProperty(property)
        }
      }

      const skuInfo = new AdditionalInfo('sku', shopgateProduct.identifiers.sku)
      product.addAdditionalInfo(skuInfo)

      const cartItem = new CartItem(cartItemId, quantity, 'product', product)
      // TODO: add messages here if necessary

      cartItems.push(cartItem)
    }
  }

  return cartItems
}
