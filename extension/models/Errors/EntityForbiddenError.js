const ERROR_CODE = 'EFORBIDDEN'

/**
 * For Magento endpoint error with code 403.
 *
 * @extends Error
 */
class EntityForbiddenError extends Error {
  constructor () {
    super('Entity forbidden.')

    this.code = ERROR_CODE
  }
}

module.exports = EntityForbiddenError
