const Coupon = require('../models/requestCoupons/coupons')
const InvalidCallError = require('../models/Errors/InvalidCallError')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const coupons = input.coupons
  const transformedCoupons = []

  for (let i in coupons) {
    let transformedCoupon = new Coupon(coupons[i])

    if (transformedCoupon.code !== '') {
      transformedCoupons.push(transformedCoupon)
    }
  }

  if (transformedCoupons.length <= 0) {
    context.log.error('Error: Wrong parameter format or no discount (coupon) codes given.')
    return cb(new InvalidCallError())
  }

  cb(null, {transformedCoupons})
}
