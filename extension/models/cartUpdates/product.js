class Product {
  constructor (cartItemId, productId, quantity, parent) {
    this.cartItemId = cartItemId
    this.productId = productId
    this.quantity = quantity
    this.parent = parent
  }

  /**
   * Transforms the product to an update item so the shopgate plugin for
   * magento understands the update request
   */
  transformToUpdateProductItem () {
    return {
      cartItemId: this.cartItemId,
      product: {
        'product_id': this.productId,
        'qty': this.quantity
      }
    }
  }
}

module.exports = Product
