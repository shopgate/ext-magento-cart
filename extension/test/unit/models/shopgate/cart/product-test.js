const assert = require('assert')
const SavedPrice = require('../../../../../models/shopgate/cart/savedPrice')
const AppliedDiscount = require('../../../../../models/shopgate/cart/appliedDiscount')
const Property = require('../../../../../models/shopgate/cart/property')
const AdditionalInfo = require('../../../../../models/shopgate/cart/additionalInfo')
const Price = require('../../../../../models/shopgate/cart/price')
const Product = require('../../../../../models/shopgate/cart/product')

describe('Product', () => {
  it('should create a Product object', (done) => {
    const savedPrice = new SavedPrice(1, 'any')
    const ad = new AppliedDiscount(savedPrice)
    ad.setCode('20FFAD')
    ad.setDescription('description')
    ad.setLabel('label')

    const price = new Price('USD', 1, 1)
    const property = new Property('type', 'value')
    const addAdditionalInfo = new AdditionalInfo('label', 'value')

    const p = new Product('id', 'name', 'http://image.de', price)
    p.addAdditionalInfo(addAdditionalInfo)
    p.addProperty(property)
    p.addAppliedDiscount(ad)

    assert.equal(p.id, 'id')
    assert.equal(p.name, 'name')
    assert.equal(p.featuredImageUrl, 'http://image.de')
    assert.deepEqual(p.price, price)
    assert.deepEqual(p.properties, [property])
    assert.deepEqual(p.appliedDiscounts, [ad])

    done()
  })
})
