const assert = require('assert')
const expect = require('chai').expect
const step = require('../../../cart/transformToShopgateCart')
const magentoCart = require('../data/magento-cart')
const magentoCartWithItemError = require('../data/magento-cart-with-item-error')
const shopgateProducts = require('../data/shopgate-products')
const resultingCart = require('../data/shopgate-cart')
const magentoCartDiscount = require('../data/magento-cart-discount')
const magentoCartCouponDiscount = require('../data/magento-cart-coupon-discount')
const shopgateCartDiscountTotal = require('../data/shopgate-cart-discount-total')
const shopgateCartDiscountItem = require('../data/shopgate-cart-discount-item')
const shopgateCartDiscountCouponTotal = require('../data/shopgate-cart-discount-coupon-total')
const shopgateCartDiscountCouponItem = require('../data/shopgate-cart-discount-coupon-item')
const input = { magentoCart, shopgateProducts }
const inputWithItemErrors = {
  magentoCart: magentoCartWithItemError,
  shopgateProducts
}

/**
 * Set all necessary properties to mark the cart as unorderable
 */
function setCartToNotOrderable () {
  magentoCart.has_error = true
  magentoCart.errors = []
  resultingCart.isOrderable = false
  resultingCart.flags.orderable = false
}

/**
 * Insert a valid Coupon discount to the cart
 */
function insertCouponDiscountToCart () {
  magentoCart.coupon_code = 'register10'
  magentoCart.totals.discount = magentoCartCouponDiscount
  resultingCart.totals.discount = shopgateCartDiscountCouponTotal
  resultingCart.totals.push(shopgateCartDiscountCouponTotal)
  resultingCart.cartItems.push(shopgateCartDiscountCouponItem)
}

/**
 * Insert a valid discount (cart rule without coupon code) to the cart
 */
function insertDiscountToCart () {
  magentoCart.coupon_code = '1'
  magentoCart.totals.discount = magentoCartDiscount
  resultingCart.totals.push(shopgateCartDiscountTotal)
  resultingCart.cartItems.push(shopgateCartDiscountItem)
}

/**
 * Reverts insertCouponDiscountToCart() and insertDiscountToCart()
 */
function removeCouponDiscountFromCart () {
  magentoCart.coupon_code = null
  resultingCart.totals.pop()
  resultingCart.cartItems.pop()
}

describe('transformToShopgateCart', () => {
  // Reset the properties to the default values
  beforeEach(() => {
    magentoCart.has_error = false
    resultingCart.isOrderable = true
    resultingCart.flags.orderable = true
  })

  describe('transformToShopgateCart without coupons', () => {
    const context = { config: { enableCoupons: false } }
    it('should transform a magento cart to a shopgate cart', (done) => {
      step(context, input, (err, result) => {
        assert.ifError(err)
        expect(resultingCart).to.eql(result)
        assert.strictEqual(result.isOrderable, true)
        done()
      })
    })

    it('should transform a magento cart to a shopgate cart, not orderable caused by cart has error', (done) => {
      setCartToNotOrderable()

      step(context, input, (err, result) => {
        assert.ifError(err)
        expect(resultingCart).to.eql(result)
        assert.deepStrictEqual(result.isOrderable, false)
        done()
      })
    })

    it('should set cart to not ordable in case an item has an error', (done) => {
      step(context, inputWithItemErrors, (err, result) => {
        assert.ifError(err)
        assert.deepStrictEqual(result.isOrderable, false)
        done()
      })
    })
  })

  describe('transformToShopgateCart with coupons', () => {
    const context = { config: { enableCoupons: true } }
    // Set up the cart to have coupons enabled
    beforeEach(() => {
      resultingCart.enableCoupons = true
      resultingCart.flags.coupons = true
    })

    it('should transform a magento cart to a shopgate cart with coupon', (done) => {
      insertCouponDiscountToCart()

      step(context, input, (err, result) => {
        assert.ifError(err)
        expect(resultingCart).to.eql(result)
        assert.deepStrictEqual(result.isOrderable, true)
        done()
      })
      removeCouponDiscountFromCart()
    })

    it('should transform a magento cart to a shopgate cart with coupon, not orderable caused by cart has error', (done) => {
      setCartToNotOrderable()
      insertCouponDiscountToCart()

      step(context, input, (err, result) => {
        assert.ifError(err)
        expect(resultingCart).to.eql(result)
        assert.strictEqual(result.isOrderable, false)
        done()
      })
      removeCouponDiscountFromCart()
    })

    it('should transform a magento cart to a shopgate cart with coupon but no coupon code', (done) => {
      insertDiscountToCart()

      step(context, input, (err, result) => {
        assert.ifError(err)
        expect(resultingCart).to.eql(result)
        assert.deepStrictEqual(result.isOrderable, true)
        done()
      })
      removeCouponDiscountFromCart()
    })
  })
})
