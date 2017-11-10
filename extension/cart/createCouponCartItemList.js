const Coupon = require('../models/requestCoupons/coupons')

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
    transformedCoupons.push(transformedCoupon)
  }
  cb(null, {transformedCoupons})
}
