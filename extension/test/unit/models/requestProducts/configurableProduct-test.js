const assert = require('assert')
const ConfigurableProduct = require('../../../../models/requestProducts/configurableProduct')

describe('ConfigurableProduct', () => {
  it('should create a simple product', (done) => {
    const cp = new ConfigurableProduct('1', 1)
    cp.addPropertyToSuperAttribute('foo', 'bar')

    assert.strictEqual(cp.productId, '1')
    assert.strictEqual(cp.quantity, 1)
    assert.strictEqual(cp.superAttribute.foo, 'bar')
    done()
  })

  it('should return a transformed json object', (done) => {
    const cp = new ConfigurableProduct('1', 1)
    cp.addPropertyToSuperAttribute('foo', 'bar')

    const jsonObj = cp.toJSON()
    assert.strictEqual(jsonObj.product['product_id'], cp.productId)
    assert.strictEqual(jsonObj.product['qty'], cp.quantity)
    assert.strictEqual(jsonObj.product['super_attribute'].foo, 'bar')
    done()
  })
})
