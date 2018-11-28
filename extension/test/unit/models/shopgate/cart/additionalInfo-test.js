const assert = require('assert')
const AdditionalInfo = require('../../../../../models/shopgate/cart/additionalInfo')

describe('AdditionalInfo', () => {
  it('should create an AdditionalInfo object', (done) => {
    const ai = new AdditionalInfo('label', 'value')
    assert.strictEqual(ai.label, 'label')
    assert.strictEqual(ai.value, 'value')
    done()
  })
})
