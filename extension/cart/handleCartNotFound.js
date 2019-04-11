/**
 * @param {Error} error
 * @param {SDKContext} context
 */
module.exports = async (error, context) => {
  if (!error) {
    return { cartNotFound: false }
  }

  if (error.code && error.code === 'ENOTFOUND') {
    const storage = !context.meta.userId ? 'device' : 'user'
    await context.storage[storage].del('cartId')

    return { cartNotFound: true }
  }

  throw error
}
