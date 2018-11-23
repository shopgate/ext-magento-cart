const assert = require('assert')
const SimpleProduct = require('../../../../models/requestProducts/simpleProduct')

describe('SimpleProduct', () => {
  it('should create a simple product', (done) => {
    const sp = new SimpleProduct('1', 1)
    assert.strictEqual(sp.productId, '1')
    assert.strictEqual(sp.quantity, 1)
    done()
  })

  it('should return a transformed json object', (done) => {
    const sp = new SimpleProduct('1', 1)
    const jsonObj = sp.toJSON()

    assert.strictEqual(jsonObj.product['product_id'], sp.productId)
    assert.strictEqual(jsonObj.product['qty'], sp.quantity)
    done()
  })
})
