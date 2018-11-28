const assert = require('assert')
const Text = require('../../../../../models/shopgate/cart/text')

describe('Text', () => {
  it('should create a text object', (done) => {
    const t = new Text('t')
    assert.strictEqual(t.legal, 't')
    done()
  })
})
