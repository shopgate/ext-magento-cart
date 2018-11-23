const assert = require('assert')
const Message = require('../../../../../models/shopgate/cart/message')

describe('Message', () => {
  it('should create a Message object', (done) => {
    const t = new Message('t', 'm')
    t.setCode('c')
    assert.strictEqual(t.type, 't')
    assert.strictEqual(t.message, 'm')
    assert.strictEqual(t.code, 'c')
    done()
  })
})
