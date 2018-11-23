const assert = require('assert')
const step = require('../../../cart/transformToShopgateCart')
const magentoCart = require('../data/magento-cart')
const magentoCartWithItemError = require('../data/magento-cart-with-item-error')
const shopgateProducts = require('../data/shopgate-products')
const resultingCart = require('../data/shopgate-cart')
const magentoCartDiscount = require('../data/magento-cart-discount')
const shopgateCartDiscount = require('../data/shopgate-cart-discount')
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
 * Insert a valid discount to the cart
 */
function insertDiscountToCart () {
  magentoCart.coupon_code = 'register10'
  magentoCart.totals.push(magentoCartDiscount)
  resultingCart.totals.push(shopgateCartDiscount)
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
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, true)
        done()
      })
    })

    it('should transform a magento cart to a shopgate cart, not orderable caused by cart has error', (done) => {
      setCartToNotOrderable()

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, false)
        done()
      })
    })

    it('should set cart to not ordable in case an item has an error', (done) => {
      step(context, inputWithItemErrors, (err, result) => {
        assert.ifError(err)
        assert.equal(result.isOrderable, false)
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
      insertDiscountToCart()

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, true)
        done()
      })
    })

    it('should transform a magento cart to a shopgate cart with coupon, not orderable caused by cart has error', (done) => {
      setCartToNotOrderable()
      insertDiscountToCart()

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, false)
        done()
      })
    })
  })
})
