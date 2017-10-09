const assert = require('assert')
const Total = require('../../../../../models/shopgate/cart/total')

describe('Total', () => {
  it('should create a total object', (done) => {
    const t = new Total('t', 'l', 1)
    assert.equal(t.type, 't')
    assert.equal(t.label, 'l')
    assert.equal(t.amount, 1)
    done()
  })
})
