class SimpleProduct {
  constructor (productId, quantity) {
    this.productId = productId
    this.quantity = quantity
  }

  toJSON () {
    return {
      product: {
        'product_id': this.productId,
        'qty': this.quantity
      }
    }
  }
}

module.exports = SimpleProduct
