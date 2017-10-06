class Cart {
  constructor (cartItems, currency, totals, enableCoupons) {
    this.cartItems = cartItems
    this.currency = currency
    this.totals = totals
    this.enableCoupons = enableCoupons
    this.messages = []
    this.text = null
    this.isTaxIncluded = null
    this.isOrderable = null
  }

  addMessage (message) {
    this.messages.push(message)
  }

  setText (text) {
    this.text = text
  }

  setIsTaxIncluded (value) {
    this.isTaxIncluded = value
  }

  setIsOrderable (value) {
    this.isOrderable = value
  }
}

module.exports = Cart
