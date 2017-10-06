class CartItem {
  constructor (id, quantity, type, item) {
    this.id = id
    this.quantity = quantity
    this.type = type
    this.messages = []
    this[type] = item
  }

  addMessage (message) {
    this.messages.push(message)
  }
}

module.exports = CartItem
