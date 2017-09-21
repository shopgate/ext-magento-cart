const step = require('../../magento/transformProductsWithCharacteristics')
const assert = require('assert')

describe('transformProductsWithCharacteristics', () => {
  it('should return an error because nothing is implemented', (done) => {
    step(null, null, (err) => {
      assert.equal(err.message, 'Not implemented')
      done()
    })
  })
})
