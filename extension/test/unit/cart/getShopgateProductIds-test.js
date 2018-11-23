const assert = require('assert')
const step = require('../../../cart/getShopgateProductIds')

describe('getShopgateProductIds', () => {
  it('should get the shopgate product id from the magento', (done) => {
    const magentoCart = require('../data/magento-cart')
    const input = { magentoCart }
    const resultingArray = ['simple1', 'parent1-child1', 'parent1-child2']

    step(null, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result, { productIds: resultingArray, offset: 0, limit: 100, characteristics: true })
      done()
    })
  })
})
