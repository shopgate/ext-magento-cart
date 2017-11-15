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

  for (let j, i = 0; i < products.length; i++) {
    let transformedProduct = null
    if (products[i].hasOwnProperty('metadata') && products[i].metadata.type.toLowerCase() === 'configurable') {
      transformedProduct = new ConfigurableProduct(getProductId(products[i].productId), products[i].quantity)
      for (j = 0; j < products[i].metadata.selectedAttributes.length; j++) {
        transformedProduct.addProdertyToSuperAttribure(
          products[i].metadata.selectedAttributes[j].attributeId,
          products[i].metadata.selectedAttributes[j].optionId
        )
      }
    } else if (isSimpleProduct(products[i].productId)) {
      throw new Error(`Failed to add product '${products[i].productId}'. Required field "metadata" is missing.`)
    } else {
      transformedProduct = new SimpleProduct(products[i].productId, products[i].quantity)
    }
    transformedProducts.push(transformedProduct)
  }
  cb(null, {transformedProducts})
}

/**
 * Takes a Shopgate-uid and returns the Magento product id part of it
 *
 * @param $combinedId
 * @return {string}
 */
function getProductId ($combinedId) {
  const idList = $combinedId.toString().split('-')
  return Array.isArray(idList) ? idList[0].toString() : $combinedId.toString()
}

/**
 * Takes a Shopgate-uid and checks if the uid refers to a simple product or not
 *
 * @param $combinedId
 * @return {boolean}
 */
function isSimpleProduct ($combinedId) {
  const idList = $combinedId.toString().split('-')
  return Array.isArray(idList) && idList.length > 1
}
