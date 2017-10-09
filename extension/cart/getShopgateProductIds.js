/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const magentoCart = input.magentoCart

  // TODO: return [] if cart is empty

  const productIds = getShopgateProductIds(magentoCart)

  // TODO: Limit and offset are used as a kind of workaround .
  //       We should be able to ask for a unlimited count of products
  // TODO: These could also be excluded into a static step
  cb(null, {productIds, offset: 0, limit: 100, characteristics: true})
}

function getShopgateProductIds (magentoCart) {
  const productIds = []

  for (let i in magentoCart.items) {
    if (magentoCart.items[i]['product_type'] === 'simple') {
      const productId = magentoCart.items[i]['product_id']

      // If it's a variant, we need to transform it into a special shopgate
      // variant id
      if (magentoCart.items[i]['parent_item_id']) {
        const parentElement = magentoCart.items.find((element) => {
          return element['item_id'] === magentoCart.items[i]['parent_item_id']
        })
        productIds.push(`${parentElement['product_id']}-${productId}`)
        continue
      }
      productIds.push(productId)
    }
  }

  return productIds
}
