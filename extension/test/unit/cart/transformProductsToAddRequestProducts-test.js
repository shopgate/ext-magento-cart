const assert = require('assert')
const step = require('../../../cart/transformProductsToAddRequestProducts')

describe('transformProductsToAddRequestProducts', () => {
  it('should transform frontend products to magentoAddToCart-products', (done) => {
    const products = [
      {
        productId: '1',
        quantity: 1
      },
      {
        productId: '2',
        quantity: 2,
        properties: [
          {id: 'pl1', value: 'pv1'},
          {id: 'pl2', value: 'pv2'}
        ]
      }
    ]

    const input = {products}

    step(null, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.transformedProducts[0].productId, products[0].productId)
      assert.equal(result.transformedProducts[0].quantity, products[0].quantity)
      assert.equal(result.transformedProducts[1].productId, products[1].productId)
      assert.equal(result.transformedProducts[1].quantity, products[1].quantity)
      assert.equal(result.transformedProducts[1].superAttribute.pl1, 'pv1')
      assert.equal(result.transformedProducts[1].superAttribute.pl2, 'pv2')
      done()
    })
  })
})
