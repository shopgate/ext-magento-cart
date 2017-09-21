module.exports = function (context, input, cb) {
  // TODO: input validation?
  const shopgateProduct = input.shopgateProduct
  const magentoProduct = input.magentoProduct

  // TODO: mapping?
  shopgateProduct.type = magentoProduct['type_id']

  cb(null, {product: shopgateProduct})
}
