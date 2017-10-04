const SimpleProduct = require('../models/requestProducts/simpleProduct')
const ConfigurableProduct = require('../models/requestProducts/configurableProduct')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const products = input.products
  const transformedProducts = []

  for (let i in products) {
    let transformedProduct = null
    if (products[i].hasOwnProperty('properties')) {
      // TODO: Is productId the product id of the parent or the child ?!
      // It may have to be split by '-' and only the first element of the resulting array is the productId
      transformedProduct = new ConfigurableProduct(products[i].productId, products[i].quantity)
      for (let j in products[i].properties) {
        const characteristicId = products[i].properties[j].labelId  // TODO: this may not be implemented in frontend
        const characteristicValueId = products[i].properties[j].valueId // TODO: this may not be implemented in frontend
        transformedProduct.addProdertyToSuperAttribure(characteristicId, characteristicValueId)
      }
    } else {
      transformedProduct = new SimpleProduct(products[i].productId, products[i].quantity)
    }
    if (transformedProduct) transformedProducts.push(transformedProduct)
  }
  cb(null, {transformedProducts})
}
