const assert = require('assert')
const Price = require('../../../../../models/shopgate/cart/price')

describe('Price', () => {
  it('should create a Price object', (done) => {
    const t = new Price('u', 'v', 's')
    assert.equal(t.unit, 'u')
    assert.equal(t.default, 'v')
    assert.equal(t.special, 's')
    done()
  })
})
