const assert = require('assert')
const Message = require('../../../../../models/shopgate/cart/message')

describe('Message', () => {
  it('should create a Message object', (done) => {
    const t = new Message('t', 'm')
    t.setCode('c')
    assert.equal(t.type, 't')
    assert.equal(t.message, 'm')
    assert.equal(t.code, 'c')
    done()
  })
})
