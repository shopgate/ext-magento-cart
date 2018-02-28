const CART = 'cart'

class CartStorageHandler {
  constructor (storages) {
    this.storages = storages
  }

  /**
   * @param {object} cart
   * @param {boolean} isLoggedIn
   * @param {StepCallback} cb
   */
  set (cart, isLoggedIn, cb) {
    const storage = isLoggedIn ? 'user' : 'device'
    this.storages[storage].set(CART, cart, (err) => {
      if (err) return cb(err)
      cb()
    })
  }

  /**
   *
   * @param {boolean} isLoggedIn
   * @param {StepCallback} cb
   */
  get (isLoggedIn, cb) {
    const storage = isLoggedIn ? 'user' : 'device'
    this.storages[storage].get(CART, (err, result) => {
      if (err) return cb(err)
      cb(null, result)
    })
  }
}

module.exports = CartStorageHandler
