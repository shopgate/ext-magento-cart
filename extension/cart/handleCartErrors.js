/**
 * @param {Error} error
 * @param {SDKContext} context
 * @param {Object} input
 */
module.exports = async (error, context, input) => {
  if (!error) {
    return {
      isOrderable: input.isOrderable,
      isTaxIncluded: input.isTaxIncluded,
      currency: input.currency,
      messages: input.messages,
      text: input.text,
      cartItems: input.cartItems,
      totals: input.totals,
      enableCoupons: input.enableCoupons,
      flags: input.flags
    }
  }

  if (error.code && (error.code === 'ENOTFOUND' || error.code === 'EFORBIDDEN')) {
    const storage = !context.meta.userId ? 'device' : 'user'
    await context.storage[storage].del('cartId')

    return {
      isOrderable: false,
      isTaxIncluded: false,
      currency: 'unkown',
      messages: [],
      text: null,
      cartItems: [],
      totals: [],
      enableCoupons: false,
      flags: {
        orderable: false,
        taxIncluded: false,
        coupons: false
      }
    }
  }

  throw error
}
