/**
 * @param {object} context
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  // TODO: input validation?
  const shopgateProduct = input.shopgateProduct
  const magentoProduct = input.magentoProduct

  if (!magentoProduct['type_id']) return cb(new Error('type_id is missing in magentoProduct'))

  shopgateProduct.type = magentoProduct['type_id']

  cb(null, {product: shopgateProduct})
}
