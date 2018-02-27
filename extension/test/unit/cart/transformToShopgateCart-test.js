const assert = require('assert')
const step = require('../../../cart/transformToShopgateCart')
const magentoCart = require('../data/magento-cart')
const shopgateProducts = require('../data/shopgate-products')
const resultingCart = require('../data/shopgate-cart')
const input = {magentoCart, shopgateProducts}

describe('transformToShopgateCart', () => {
  describe('transformToShopgateCart without coupons', () => {
    const context = {config: {enableCoupons: false}}

    it('should transform a magento cart to a shopgate cart', (done) => {
      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, true)
        done()
      })
    })

    it('should transform a magento cart to a shopgate cart, not orderable caused by cart has error', (done) => {
      magentoCart.has_error = true

      resultingCart.isOrderable = false
      resultingCart.flags.orderable = false

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, false)
        done()
      })
    })
  })

  describe('transformToShopgateCart with coupons', () => {
    const context = {config: {enableCoupons: true}}

    it('should transform a magento cart to a shopgate cart with coupon', (done) => {
      magentoCart.coupon_code = 'register10'
      magentoCart.totals.push({'code': 'discount', 'title': 'Discount (register10)', 'value': '-25.0000'})
      magentoCart.has_error = false

      resultingCart.enableCoupons = true
      resultingCart.flags.coupons = true
      resultingCart.totals.push({'amount': -25, 'label': 'Discount (register10)', 'type': 'discount'})
      resultingCart.isOrderable = true
      resultingCart.flags.orderable = true

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, true)
        done()
      })
    })

    it('should transform a magento cart to a shopgate cart with coupon, not orderable caused by cart has error', (done) => {
      magentoCart.coupon_code = 'register10'
      magentoCart.totals.push({'code': 'discount', 'title': 'Discount (register10)', 'value': '-25.0000'})
      magentoCart.has_error = true

      resultingCart.enableCoupons = true
      resultingCart.flags.coupons = true
      resultingCart.totals.push({'amount': -25, 'label': 'Discount (register10)', 'type': 'discount'})
      resultingCart.isOrderable = false
      resultingCart.flags.orderable = false

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result, resultingCart)
        assert.equal(result.isOrderable, false)
        done()
      })
    })
  })
})
