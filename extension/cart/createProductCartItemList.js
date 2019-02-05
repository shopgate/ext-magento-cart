const SimpleProduct = require('../models/requestProducts/simpleProduct')
const ConfigurableProduct = require('../models/requestProducts/configurableProduct')
const InvalidCallError = require('../models/Errors/InvalidCallError')

/**
 * @typedef {Object} createProductCartItemListInput
 * @property {[createProductCartItemListInputProduct]} products
 */
/**
 * @typedef {Object} createProductCartItemListInputProduct
 * @property {createProductCartItemListInputProductMetadata} metadata
 * @property {string} productId - e.g. "135-75"
 * @property {number} quantity - how many to add to cart, e.g. 1
 * @property {[createProductCartItemListInputProductProperty]} properties - custom inputs
 */
/**
 * @typedef {Object} createProductCartItemListInputProductMetadata
 * @property {[createProductCartItemListInputProductMetadataSelectedAttribute]} selectedAttributes
 */
/**
 * @typedef {Object} createProductCartItemListInputProductMetadataSelectedAttribute
 * @property {string} attributeId - magento internal attribute id, that is an id of attribute "color"
 * @property {string} optionId - magento internal option id, that is an id of option "red"
 */
/**
 * @typedef {Object} createProductCartItemListInputProductProperty
 * @property {string} type - either "option" or "input"
 * @property {string} id - magento internal input id
 * @property {string} value
 */
/**
 * @param {StepContext} context
 * @param {createProductCartItemListInput} input
 * @param {StepCallback} cb
 * @param {Error|null} cb.err
 * @param {[SimpleProduct] | [ConfigurableProduct]} cb.return
 */
module.exports = function (context, input, cb) {
  const products = input.products
  const transformedProducts = []

  for (let j, i = 0; i < products.length; i++) {
    let transformedProduct = null
    if (products[i].hasOwnProperty('metadata') && products[i].metadata.type.toLowerCase() === 'configurable') {
      transformedProduct = new ConfigurableProduct(getProductId(products[i].productId), products[i].quantity)
      for (j = 0; j < products[i].metadata.selectedAttributes.length; j++) {
        transformedProduct.addPropertyToSuperAttribute(
          products[i].metadata.selectedAttributes[j].attributeId,
          products[i].metadata.selectedAttributes[j].optionId
        )
      }
    } else if (!isSimpleProduct(products[i].productId)) {
      context.log.error(`Failed to add product '${products[i].productId}'. Required field "metadata" is missing.`)
      return cb(new InvalidCallError())
    } else {
      transformedProduct = new SimpleProduct(products[i].productId, products[i].quantity)
    }
    if (products[i].hasOwnProperty('properties')) {
      products[i].properties.forEach(function(property) {
        transformedProduct.addOptions(
          property.id,
          property.value
        )
      })
    }
    transformedProducts.push(transformedProduct)
  }
  cb(null, { transformedProducts })
}

/**
 * Takes a Shopgate-uid and returns the Magento product id part of it
 *
 * @param {string} combinedId - e.g. a configurable product id of "175-53" will return 175 (the parent), 53 being the child
 * @return {string}
 */
function getProductId (combinedId) {
  const idList = combinedId.toString().split('-')
  return Array.isArray(idList) ? idList[0].toString() : combinedId.toString()
}

/**
 * Takes a Shopgate-uid and checks if the uid refers to a simple product or not
 *
 * @param {string} combinedId - a simple product would have one id, e.g. "175"
 * @return {boolean}
 */
function isSimpleProduct (combinedId) {
  const idList = combinedId.toString().split('-')
  return Array.isArray(idList) && idList.length === 1
}
