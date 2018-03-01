const isString = require('lodash/isString')
const ERROR_CODE = 'EINTERNAL'

/**
 * For truly unknown Magento endpoint errors, e.g. code 500s.
 * Please consult the magento swagger definition for possible error
 * outputs and use this error as a fallback to all unknown cases.
 *
 * @extends Error
 * @param {string} [message=An internal error occurred.]
 * @default An internal error occurred.
 */
class MagentoEndpointError extends Error {
  constructor (message) {
    super(message !== '' && isString(message)
      ? message
      : 'An internal error occurred.')
    this.code = ERROR_CODE
  }
}

module.exports = MagentoEndpointError
