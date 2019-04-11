const ERROR_CODE = 'ENOTFOUND'

/**
 * For truly unknown Magento endpoint errors, e.g. code 404.
 * Please consult the magento swagger definition for possible error
 * outputs and use this error as a fallback to all unknown cases.
 *
 * @extends Error
 */
class EntityNotFoundError extends Error {
  constructor () {
    super('Entity not found.')

    this.code = ERROR_CODE
  }
}

module.exports = EntityNotFoundError
