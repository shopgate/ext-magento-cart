/**
 * @class
 * @classdesc Holder for coupon codes, helps with sending requests to magento
 */
class Coupons {
  /**
   * @param {string} code
   */
  constructor (code) {
    this.code = code
  }

  /**
   * @return {{coupon: {couponCode: string}}}
   */
  toJSON () {
    return {
      coupon: {
        'couponCode': this.code
      }
    }
  }
}

module.exports = Coupons
