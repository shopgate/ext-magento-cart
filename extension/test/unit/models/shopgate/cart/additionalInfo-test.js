const assert = require('assert')
const AdditionalInfo = require('../../../../../models/shopgate/cart/additionalInfo')

describe('AdditionalInfo', () => {
  it('should create an AdditionalInfo object', (done) => {
    const ai = new AdditionalInfo('label', 'value')
    assert.equal(ai.label, 'label')
    assert.equal(ai.value, 'value')
    done()
  })
})
