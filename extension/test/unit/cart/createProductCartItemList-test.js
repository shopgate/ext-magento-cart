const assert = require('assert')
const step = require('../../../cart/createProductCartItemList')

describe('createProductCartItemList', () => {
  it('should create a Magento product cart item list out of the given Shopgate add-to-cart-product-list', (done) => {
    const products = [
      {
        productId: '1',
        quantity: 1
      },
      {
        productId: '120-14',
        quantity: 2,
        metadata: {
          type: 'configurable',
          selectedAttributes: [
            {attributeId: 'pl1', optionId: 'pv1'},
            {attributeId: 'pl2', optionId: 'pv2'}
          ]
        }
      }
    ]
    const input = {products}

    // noinspection JSCheckFunctionSignatures
    step(null, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.transformedProducts[0].productId, products[0].productId)
      assert.equal(result.transformedProducts[0].quantity, products[0].quantity)
      assert.equal(result.transformedProducts[1].productId, '120')
      assert.equal(result.transformedProducts[1].quantity, products[1].quantity)
      assert.equal(result.transformedProducts[1].superAttribute.pl1, 'pv1')
      assert.equal(result.transformedProducts[1].superAttribute.pl2, 'pv2')
      done()
    })
  })

  it('it should return an error because metadata is missing from a non-simple product', (done) => {
    const products = [
      {
        productId: '120-14',
        quantity: 2
      }
    ]
    const input = {products}

    // noinspection JSCheckFunctionSignatures
    step(null, input, (err) => {
      assert.equal(err.message, 'Failed to add product \'120-14\'. Required field "metadata" is missing.')
      done()
    })
  })
})
