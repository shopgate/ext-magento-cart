const getVariantId = require('./getVariantId')
const collectAttributes = require('./collectMagentoAttributes')

/**
 * @param {Object} context
 * @param {Object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const shopgateProductVariants = input.products
  const magentoParentProduct = input.magentoParentProduct

  const newProductVariants = buildProductVariantsMetadata(shopgateProductVariants, magentoParentProduct)

  cb(null, { products: newProductVariants })
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
