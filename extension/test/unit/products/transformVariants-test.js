const rewire = require('rewire')
const step = rewire('../../../products/transformVariants')
const assert = require('assert')

function copy (stringifyable) {
  return JSON.parse(JSON.stringify(stringifyable))
}

describe('transformVariants', () => {
  describe('step', () => {
    it('should transform the variants correctly', (done) => {
      const shopgateVariants = copy(require('../data/shopgate-variants.json'))
      const magentoConfigurableProduct = copy(require('../data/magento-configurable-product.json'))
      const resultingVariants = copy(require('../data/shopgate-variants-with-magento-ids.json'))

      step(null, {products: shopgateVariants.products, characteristics: shopgateVariants.characteristics, magentoParentProduct: magentoConfigurableProduct}, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(resultingVariants, result)
        done()
      })
    })

    it('should return an error because the labels can\'t be found', (done) => {
      const shopgateVariants = copy(require('../data/shopgate-variants.json'))
      const magentoConfigurableProduct = copy(require('../data/magento-configurable-product.json'))

      delete shopgateVariants.characteristics[0].id
      delete shopgateVariants.characteristics[0].label

      step(null, {products: shopgateVariants.products, characteristics: shopgateVariants.characteristics, magentoParentProduct: magentoConfigurableProduct}, (err) => {
        assert.equal(err.message, `can't find labels for shopgate characteristicId "1" and characteristicValueId "1-1"`)
        done()
      })
    })
  })

  describe('updateVariantsByLabelMapping', () => {
    it('should return an error because the magento ids can\'t be found', (done) => {
      const shopgateVariants = copy(require('../data/shopgate-variants.json'))
      const newCharacteristics = [
        {
          id: 'a2',
          label: 'Size',
          values: [
            { id: 'a2o1', label: 'S' },
            { id: 'a2o2', label: 'M' }
          ]
        }
      ]

      const updateVariantsByLabelMapping = step.__get__('updateVariantsByLabelMapping')

      try {
        updateVariantsByLabelMapping(shopgateVariants, newCharacteristics)
      } catch (err) {
        assert.equal(err.message, 'can\'t find magento characteristicId and characteristicValueId for characteristicLabel "Color" and characteristicValueLabel "Rot"')
        done()
      }
    })
  })
})
