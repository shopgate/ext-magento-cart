const assert = require('assert')
const SimpleProduct = require('../../../../models/requestProducts/simpleProduct')

describe('SimpleProduct', () => {
  it('should create a simple product', (done) => {
    const sp = new SimpleProduct('1', 1)
    assert.equal(sp.productId, '1')
    assert.equal(sp.quantity, 1)
    done()
  })

  it('should return a transformed json object', (done) => {
    const sp = new SimpleProduct('1', 1)
    const jsonObj = sp.toJSON()

    assert.equal(jsonObj.product['product_id'], sp.productId)
    assert.equal(jsonObj.product['qty'], sp.quantity)
    done()
  })
})
