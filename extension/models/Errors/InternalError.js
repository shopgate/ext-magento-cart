const ExtendableError = require('./ExtendableError')
const EUNKNOWN = 'EUNKNOWN'

class InternalError extends ExtendableError {
  constructor (displayMessage) {
    super(displayMessage)
    this.code = EUNKNOWN
  }
}

module.exports = InternalError
