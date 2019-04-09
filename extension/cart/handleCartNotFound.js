module.exports = async (error, context) => {
  if (!error) {
    return {}
  }

  if (error.code && error.code === 'ENOTFOUND') {
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
