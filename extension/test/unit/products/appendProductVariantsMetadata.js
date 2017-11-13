const rewire = require('rewire')
const step = rewire('../../../products/appendProductVariantsMetadata')
const assert = require('assert')

function copy (stringifyable) {
  return JSON.parse(JSON.stringify(stringifyable))
}

describe('appendProductVariantsMetadata', () => {
  describe('step', () => {
    it('should add the product variants metadata correctly', (done) => {
      const shopgateVariants = copy(require('../data/shopgate-variants.json'))
      const magentoConfigurableProduct = copy(require('../data/magento-configurable-product.json'))
      const resultingVariants = copy(require('../data/shopgate-variants-with-magento-ids.json'))

      step(null, {products: shopgateVariants.products, characteristics: shopgateVariants.characteristics, magentoParentProduct: magentoConfigurableProduct}, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(resultingVariants, result)
        done()
      })
    })
  })
})
