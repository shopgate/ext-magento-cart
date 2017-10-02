const assert = require('assert')
const ConfigurableProduct = require('../../../../models/addProductsToCart/configurableProduct')

describe('ConfigurableProduct', () => {
  it('should create a simple product', (done) => {
    const cp = new ConfigurableProduct('1', 1)
    cp.addProdertyToSuperAttribure('foo', 'bar')

    assert.equal(cp.productId, '1')
    assert.equal(cp.quantity, 1)
    assert.equal(cp.superAttribute.foo, 'bar')
    done()
  })

  it('should return a transformed json object', (done) => {
    const cp = new ConfigurableProduct('1', 1)
    cp.addProdertyToSuperAttribure('foo', 'bar')

    const jsonObj = cp.toJSON()
    assert.equal(jsonObj['product_id'], cp.productId)
    assert.equal(jsonObj['qty'], cp.quantity)
    assert.equal(jsonObj['super_attribute'].foo, 'bar')
    done()
  })
})
