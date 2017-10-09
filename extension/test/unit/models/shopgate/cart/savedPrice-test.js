const assert = require('assert')
const SavedPrice = require('../../../../../models/shopgate/cart/savedPrice')

describe('SavedPrice', () => {
  it('should create a SavedPrice object', (done) => {
    const t = new SavedPrice(123, 't')
    assert.equal(t.value, 123)
    assert.equal(t.type, 't')
    done()
  })
})
