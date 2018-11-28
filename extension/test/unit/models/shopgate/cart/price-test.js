const assert = require('assert')
const Price = require('../../../../../models/shopgate/cart/price')

describe('Price', () => {
  it('should create a Price object', (done) => {
    const t = new Price('u', 'v', 's')
    assert.strictEqual(t.unit, 'u')
    assert.strictEqual(t.default, 'v')
    assert.strictEqual(t.special, 's')
    done()
  })
})
