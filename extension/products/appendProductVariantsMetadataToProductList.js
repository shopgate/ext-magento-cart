const getVariantId = require('./getVariantId')
const collectAttributes = require('./collectMagentoAttributes')

/**
 * @typedef {Object} ShopgateProduct
 * @property {string} id
 * @typedef {string} baseProductId id of the parent item if the product is a variant
 */
/**
 * @param {Object} context
 * @param {Object} input
 */
module.exports = async (context, input) => {
  const shopgateProducts = input.products
  const magentoParentProducts = input.magentoParentProducts

  let products = input.products
  if (shopgateProducts && magentoParentProducts) {
    products = buildProductWithMetadata(shopgateProducts, magentoParentProducts)
  }

  return {products}
}

/**
 * Takes a list of Shopgate variants and adds metadata to each of them
 *
 * @param {[ShopgateProduct]} shopgateProducts
 * @param {Object[]} magentoParentProducts
 */
function buildProductWithMetadata (shopgateProducts, magentoParentProducts) {
  return shopgateProducts.map(product => {
    // skip non-variant products
    if (!product.baseProductId) {
      return product
    }

    // skip current product if not in list of magento products
    const magentoParentProduct = magentoParentProducts.find(p => p.entity_id === product.baseProductId && p.hasOwnProperty('children') && p.children.hasOwnProperty('attributes'))
    if (!magentoParentProduct) {
      return product
    }

    // metadata is supposed to contain variant information
    const variantId = getVariantId(product.id)
    const attributeList = magentoParentProduct.children.attributes

    // attach variant information to product
    return {
      ...product,
      metadata: {
        type: magentoParentProduct.type_id,
        selectedAttributes: collectAttributes(variantId, attributeList)
      }
    }
  })
}
