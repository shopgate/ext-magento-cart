const assert = require('assert')
const Property = require('../../../../../models/shopgate/cart/property')

describe('Property', () => {
  it('should create a Property object', (done) => {
    const t = new Property('t', 'v')
    t.setLabel('l')
    assert.strictEqual(t.type, 't')
    assert.strictEqual(t.value, 'v')
    assert.strictEqual(t.label, 'l')
    done()
  })
})
