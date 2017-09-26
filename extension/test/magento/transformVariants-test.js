const step = require('../../magento/transformVariants')
const assert = require('assert')

describe('transformVariants', () => {
  it('should transform the variants correctly', (done) => {
    const shopgateVariants = require('./data/shopgate-variants.json')
    const magentoConfigurableProduct = require('./data/magento-configurable-product.json')
    const resultingVariants = require('./data/shopgate-variants-with-magento-ids.json')

    step(null, {products: shopgateVariants.products, characteristics: shopgateVariants.characteristics, magentoParentProduct: magentoConfigurableProduct}, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(resultingVariants, result)
      done()
    })
  })
})
