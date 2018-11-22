const get = require('lodash/get')

class MagentoErrorParser {
  /**
   * Returns a passed error with translated magento text to possibly display
   *
   * @param {Error} error
   * @param {MagentoErrorResponseBody} body
   * @returns {Error} Mutates the message property of the original class
   */
  static build (error, body) {
    error.message = MagentoErrorParser.extractMagentoError(body)
    return error
  }

  /**
   * Extracts CloudAPI plugin returned errors message
   *
   * @param {MagentoErrorResponseBody} body
   * @returns {string} - defaults to an empty string
   */
  static extractMagentoError (body) {
    const message = get(body, 'messages.error[0].message', '')
    if (message === 'Coupon is not valid.') {
      return 'cart.coupon_invalid'
    }

    return message
  }
}

module.exports = MagentoErrorParser
