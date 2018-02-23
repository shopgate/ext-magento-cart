const isString = require('lodash/isString')
const ERROR_CODE = 'EINVALIDITEM'

/**
 * These errors handle issues with items being added to cart
 * These could be invalid coupons, missing products, missing quantity, etc
 *
 * @param {string} message - error text message received from Magento
 */
class InvalidItemError extends Error {
  constructor (message) {
    super(message !== '' && isString(message)
      ? message
      : 'A problem adding item to cart occurred.')
    this.code = ERROR_CODE
  }
}

module.exports = InvalidItemError
