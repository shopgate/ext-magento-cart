const isString = require('lodash/isString')
const ERROR_CODE = 'EINVALIDCALL'

/**
 * Use this class for errors that happen in the pipeline
 * or passing information around the extension and between steps
 *
 * @param {string} [message=An extension error occurred.]
 * @default An extension error occurred.
 */
class InvalidCallError extends Error {
  constructor (message) {
    super(message !== '' && isString(message)
      ? message
      : 'An extension error occurred.')
    this.code = ERROR_CODE
  }
}

module.exports = InvalidCallError
