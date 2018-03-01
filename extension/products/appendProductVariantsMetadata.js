/**
 * @param {Object} context
 * @param {Object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const shopgateProductVariants = input.products
  const magentoParentProduct = input.magentoParentProduct

  const newProductVariants = buildProductVariantsMetadata(shopgateProductVariants, magentoParentProduct)

  cb(null, {products: newProductVariants})
}

/**
 * Takes a list of Shopgate variants and adds metadata to each of them
 *
 * @param {[Object]} shopgateVariants
 * @param {Object} magentoParentProduct
 */
function buildProductVariantsMetadata (shopgateVariants, magentoParentProduct) {
  const resultVariantList = []

  for (let i in shopgateVariants) {
    let variant = shopgateVariants[i]
    if (variant.hasOwnProperty('id') &&
      magentoParentProduct.hasOwnProperty('children') &&
      magentoParentProduct.children.hasOwnProperty('attributes')) {
      const variantId = getVariantId(variant.id)
      const attributeList = magentoParentProduct.children.attributes
      variant['metadata'] = {
        type: magentoParentProduct.type_id,
        selectedAttributes: collectAttributes(variantId, attributeList)
      }
    }

    resultVariantList.push(variant)
  }

  return resultVariantList
}

/**
 * Takes a Shopgate-uid and returns the Magento variant id part of it
 *
 * @param $combinedId
 * @return {string}
 */
function getVariantId ($combinedId) {
  const idList = $combinedId.toString().split('-')
  return idList[idList.length - 1]
}

/**
 * Takes an attribute and a list of possible attributes for the parent and returns the selection, that is required
 *
 * @param variantId
 * @param attributes
 */
function collectAttributes (variantId, attributes) {
  const selectedAttributes = []
  let i, optionIndex, option

  // iterate through all attributes
  for (let attributeIndex in attributes) {
    // find the currently selected option for every attibute
    if (attributes.hasOwnProperty(attributeIndex)) {
      for (optionIndex = 0; optionIndex < attributes[attributeIndex].options.length; optionIndex++) {
        option = attributes[attributeIndex].options[optionIndex]
        for (i = 0; i < option.products.length; i++) {
          if (option.products[i] === variantId) {
            // found the selected one, append to list
            selectedAttributes.push({attributeId: attributes[attributeIndex].id, optionId: option.id})

            // skip the rest of the options, because every variant can have only one option selected, per attribute
            optionIndex = attributes[attributeIndex].options.length
            break
          }
        }
      }
    }
  }

  return selectedAttributes
}
