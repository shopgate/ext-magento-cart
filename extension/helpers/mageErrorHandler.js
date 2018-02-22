const get = require('lodash/get')

class MageErrorHandler {
  /**
   * Translates CloudAPI plugin returned errors
   *
   * @param body - the Magento 1 specific error object
   * @returns {string}
   */
  static getDescription (body) {
    return get(body, 'messages.error[0].message', 'Unexpected error')
  }
}

module.exports = MageErrorHandler
