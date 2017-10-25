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
    if (!this.parent) {
      return {
        cartItemId: this.cartItemId,
        product: {
          productId: this.productId,
          qty: this.quantity
        }
      }
    }
    throw new Error('Configurable product is currently not supported')
  }
}

module.exports = Product
