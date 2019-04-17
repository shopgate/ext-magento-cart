const util = require('util')

const MAGENTO_ERROR_TITLE = 'Got error from magento'

/**
 * @param {context} context
 * @param {Response} response
 * @param {Object} responseBody
 */
function error (context, response, responseBody) {
  context.log.error({
    statusCode: response.statusCode,
    responseBody: responseBody
  }, MAGENTO_ERROR_TITLE)
}

/**
 * @param {context} context
 * @param {Response} response
 * @param {Object} responseBody
 */
function warn (context, response, responseBody) {
  context.log.warn({
    statusCode: response.statusCode,
    responseBody: responseBody
  }, MAGENTO_ERROR_TITLE)
}

/**
 * @param {context} context
 * @param {Date} requestStart
 * @param {Object} options
 * @param {Response} response
 * @param {string} source
 */
function debug (context, requestStart, options, response, source) {
  context.log.debug({
    duration: new Date() - requestStart,
    statusCode: response.statusCode,
    request: util.inspect(options, true, 5),
    response: util.inspect(response.body, true, 5)
  }, source)
}

module.exports = {
  error,
  debug,
  warn
}
