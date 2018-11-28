const assert = require('assert')
const Total = require('../../../../../models/shopgate/cart/total')

describe('Total', () => {
  it('should create a total object', (done) => {
    const t = new Total('t', 'l', 1)
    assert.strictEqual(t.type, 't')
    assert.strictEqual(t.label, 'l')
    assert.strictEqual(t.amount, 1)
    done()
  })
})
