const assert = require('assert')
const Property = require('../../../../../models/shopgate/cart/property')

describe('Property', () => {
  it('should create a Property object', (done) => {
    const t = new Property('t', 'v')
    t.setLabel('l')
    assert.equal(t.type, 't')
    assert.equal(t.value, 'v')
    assert.equal(t.label, 'l')
    done()
  })
})
