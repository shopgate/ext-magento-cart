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

    assert.deepEqual(ad.savedPrice, savedPrice)
    assert.equal(ad.code, '20FFAD')
    assert.equal(ad.description, 'description')
    assert.equal(ad.label, 'label')
    done()
  })
})
