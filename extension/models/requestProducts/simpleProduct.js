class SimpleProduct {
  constructor (productId, quantity) {
    this.productId = productId
    this.quantity = quantity
    this.properties = {}
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  addProperties (key, value) {
    this.properties[key] = value
  }

  toJSON () {
    return {
      product: {
        'product_id': this.productId,
        'qty': this.quantity,
        'options': this.properties
      }
    }
  }
}

module.exports = SimpleProduct
