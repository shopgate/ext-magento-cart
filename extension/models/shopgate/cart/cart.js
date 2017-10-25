class Cart {
  constructor (cartItems, currency, totals, enableCoupons) {
    this.cartItems = cartItems
    this.currency = currency
    this.totals = totals
    this.enableCoupons = enableCoupons // Backwards compatibility
    this.messages = []
    this.text = null
    this.isTaxIncluded = null // Backwards compatibility
    this.isOrderable = null // Backwards compatibility
    this.flags = {
      orderable: null,
      taxIncluded: null,
      coupons: enableCoupons
    }
  }

  addMessage (message) {
    this.messages.push(message)
  }

  setText (text) {
    this.text = text
  }

  setIsTaxIncluded (value) {
    this.isTaxIncluded = value // Backwards compatibility
    this.flags.taxIncluded = value
  }

  setIsOrderable (value) {
    this.isOrderable = value // Backwards compatibility
    this.flags.orderable = value
  }
}

module.exports = Cart
