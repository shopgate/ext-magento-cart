const SimpleProduct = require('./simpleProduct')

class ConfigurableProduct extends SimpleProduct {
  constructor (productId, quantity) {
    super(productId, quantity)
    this.superAttribute = {}
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  addProdertyToSuperAttribure (key, value) {
    this.superAttribute[key] = value
    return this
  }

  toJSON () {
    const obj = super.toJSON()
    obj.product['super_attribute'] = this.superAttribute
    return obj
  }
}

module.exports = ConfigurableProduct
