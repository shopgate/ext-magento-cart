const assert = require('assert')
const SavedPrice = require('../../../../../models/shopgate/cart/savedPrice')
const AppliedDiscount = require('../../../../../models/shopgate/cart/appliedDiscount')

describe('AppliedDiscount', () => {
  it('should create an AppliedDiscount object', (done) => {
    const savedPrice = new SavedPrice(1, 'any')
    const ad = new AppliedDiscount(savedPrice)
    ad.setCode('20FFAD')
    ad.setDescription('description')
    ad.setLabel('label')

    assert.deepStrictEqual(ad.savedPrice, savedPrice)
    assert.strictEqual(ad.code, '20FFAD')
    assert.strictEqual(ad.description, 'description')
    assert.strictEqual(ad.label, 'label')
    done()
  })
})
