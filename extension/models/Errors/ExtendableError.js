const get = require('lodash/get')
const isString = require('lodash/isString')

class ExtendableError extends Error {
  constructor (message) {
    let translatedMessage = ExtendableError.translateMessage(message)
    super(translatedMessage)
    this.name = this.constructor.name
    this.message = translatedMessage
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(translatedMessage)).stack
    }
  }

  /**
   * Returns if it's a proper error string or translates a magento object
   *
   * @param {string} message
   */
  static translateMessage (message) {
    if (message !== null && message !== undefined && isString(message)) {
      return message
    }
    return ExtendableError.translateMagentoError(message)
  }

  /**
   * Translates CloudAPI plugin returned errors
   *
   * @param {(object|string)} body - the Magento 1 specific error object
   * @param {object} body.messages
   * @param {array} body.messages.error
   * @param {string} body.messages.error[0].message
   * @returns {string} - defaults to 'Unexpected error' if it's not a correct magento cloud API error object
   */
  static translateMagentoError (body) {
    return get(body, 'messages.error[0].message', 'Unexpected error')
  }
}

module.exports = ExtendableError
