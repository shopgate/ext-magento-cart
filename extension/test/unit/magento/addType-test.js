const step = require('../../../magento/addType')
const assert = require('assert')

describe('addType', () => {
  it('should add the type of the magento product to the shopgate product', (done) => {
    const shopgateProduct = require('./data/shopgate-simple-product.json')
    const magentoProduct = require('./data/magento-simple-product.json')
    const resultingProduct = require('./data/shopgate-simple-product-with-type.json')

    const input = {shopgateProduct, magentoProduct}

    step(null, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result.product, resultingProduct)
      done()
    })
  })
})
