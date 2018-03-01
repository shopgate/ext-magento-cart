const Coupon = require('../models/requestCoupons/coupons')
const InvalidCallError = require('../models/Errors/InvalidCallError')

/**
 * @typedef {Object} CreateCouponCartItemListInput
 * @property {string[]} coupons
 */
/**
 * @param {StepContext} context
 * @param {CreateCouponCartItemListInput} input
 *
 * @param {StepCallback} cb
 * @param {(Error|null)} cb.error
 * @param {({transformedCoupons: Coupon[]} | array)} cb.return
 */
module.exports = function (context, input, cb) {
  const coupons = input.coupons
  const transformedCoupons = coupons
    .filter(code => code !== '')
    .map(code => new Coupon(code))

  if (transformedCoupons.length <= 0) {
    context.log.error('Error: Wrong parameter format or no discount (coupon) codes given.')
    return cb(new InvalidCallError())
  }

  cb(null, {transformedCoupons})
}
