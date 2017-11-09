class Coupons {
  constructor (code) {
    this.code = code
  }

  toJSON () {
    return {
      coupon: {
        'couponCode': this.code
      }
    }
  }
}

module.exports = Coupons
