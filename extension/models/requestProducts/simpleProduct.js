class SimpleProduct {
  constructor (productId, quantity) {
    this.productId = productId
    this.quantity = quantity
    this.options = {}
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  addOptions (key, value) {
    this.options[key] = value
  }

  toJSON () {
    return {
      product: {
        'product_id': this.productId,
        'qty': this.quantity,
        'options': this.options
      }
    }
  }
}

module.exports = SimpleProduct
