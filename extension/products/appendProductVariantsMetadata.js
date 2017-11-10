/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const shopgateProductVariants = input.products
  const magentoParentProduct = input.magentoParentProduct

  const newProductVariants = buildProductVariantsMetadata(shopgateProductVariants, magentoParentProduct)

  cb(null, {products: newProductVariants})
}

/**
 * Gets the characteristics as needed for the shopgate variants from the
 * magento parent product
 * @param {object[]} shopgateVariants
 * @param {object} magentoParentProduct
 */
function buildProductVariantsMetadata (shopgateVariants, magentoParentProduct) {
  return shopgateVariants
}
