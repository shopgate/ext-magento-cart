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
      assert.strictEqual(result.transformedCoupons.length, 2)
      assert.strictEqual(result.transformedCoupons[0].code, 'la')
      assert.strictEqual(result.transformedCoupons[1].code, 'ha')
      done()
    })
  })

  it('Error: no coupons are passed', (done) => {
    step(context, input, (err) => {
      assert.strictEqual(err.code, 'EINVALIDCALL')
      assert.strictEqual(err.constructor.name, 'InvalidCallError')
      done()
    })
  })
})
