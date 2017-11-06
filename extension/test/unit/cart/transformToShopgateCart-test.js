const assert = require('assert')
const step = require('../../../cart/transformToShopgateCart')

describe('transformToShopgateCart', () => {
  it('should tranform a magento cart to a shopgate cart', (done) => {
    const magentoCart = require('../data/magento-cart.json')
    const shopgateProducts = require('../data/shopgate-products')
    const resultingCart = require('../data/shopgate-cart')

    const input = {magentoCart, shopgateProducts}
    const context = {config: {enableCoupons: false}}

    step(context, input, (err, result) => {
      console.log(result)

      assert.ifError(err)
      assert.deepEqual(result, resultingCart)
      done()
    })
  })
})
