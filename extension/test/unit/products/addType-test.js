const step = require('../../../products/addType')
const assert = require('assert')

describe('addType', () => {
  it('should add the type of the magento product to the shopgate product', (done) => {
    const shopgateProduct = require('../data/shopgate-simple-product.json')
    const magentoProduct = require('../data/magento-simple-product.json')
    const resultingProduct = require('../data/shopgate-simple-product-with-type.json')

    const input = {shopgateProduct, magentoProduct}

    step(null, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result.product, resultingProduct)
      done()
    })
  })

  it('should return an error because type_id is missing in the magentoProduct', (done) => {
    const magentoProduct = require('../data/magento-simple-product.json')
    delete magentoProduct.type_id

    const input = {shopgateProduct: null, magentoProduct}

    step(null, input, (err) => {
      assert.equal(err.message, 'type_id is missing in magentoProduct')
      done()
    })
  })
})
