const assert = require('assert')
const step = require('../../../cart/createProductCartItemList')

describe('createProductCartItemList', () => {
  /** @var {StepContext} */
  const context = {
    log: {
      debug: () => {
      },
      error: () => {
      }
    }
  }

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
            { attributeId: 'pl1', optionId: 'pv1' },
            { attributeId: 'pl2', optionId: 'pv2' }
          ]
        }
      },
      {
        productId: '2',
        quantity: 1,
        options: [
          { id: '68', value: 'Text Input' }
        ]
      }
    ]
    const input = { products }

    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.strictEqual(result.transformedProducts[0].productId, products[0].productId)
      assert.strictEqual(result.transformedProducts[0].quantity, products[0].quantity)
      assert.strictEqual(result.transformedProducts[1].productId, '120')
      assert.strictEqual(result.transformedProducts[1].quantity, products[1].quantity)
      assert.strictEqual(result.transformedProducts[1].superAttribute.pl1, 'pv1')
      assert.strictEqual(result.transformedProducts[1].superAttribute.pl2, 'pv2')
      assert.strictEqual(result.transformedProducts[2].productId, '2')
      assert.strictEqual(result.transformedProducts[2].quantity, products[2].quantity)
      assert.strictEqual(result.transformedProducts[2].options[68], 'Text Input')
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
    const input = { products }

    step(context, input, (err) => {
      assert.strictEqual(err.constructor.name, 'InvalidCallError')
      assert.strictEqual(err.code, 'EINVALIDCALL')
      done()
    })
  })
})
