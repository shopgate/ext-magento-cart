const assert = require('assert')
const step = require('../../../cart/createCouponCartItemList')

describe('coupon testing in step', () => {
  const input = {}

  /** @var {StepContext} */
  const context = {
    log: {
      error: () => {
      }
    }
  }
  beforeEach(() => {
    input.coupons = []
  })

  it('Testing various coupon codes', (done) => {
    input.coupons = ['', 'la', '', 'ha', '']

    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.transformedCoupons.length, 2)
      assert.equal(result.transformedCoupons[0].code, 'la')
      assert.equal(result.transformedCoupons[1].code, 'ha')
      done()
    })
  })

  it('Error: no coupons are passed', (done) => {
    step(context, input, (err) => {
      assert.equal(err.code, 'EINVALIDCALL')
      assert.equal(err.constructor.name, 'InvalidCallError')
      done()
    })
  })
})
