const util = require('util')

const MAGENTO_ERROR_TITLE = 'Got error from magento'

/**
 * @param {Logger} log
 * @param {Response} response
 * @param {Object} responseBody
 */
function error (log, response, responseBody) {
  log.error({
    statusCode: response.statusCode,
    responseBody: responseBody
  }, MAGENTO_ERROR_TITLE)
}

/**
 * @param {Logger} log
 * @param {Response} response
 * @param {Object} responseBody
 */
function warn (log, response, responseBody) {
  log.warn({
    statusCode: response.statusCode,
    responseBody: responseBody
  }, MAGENTO_ERROR_TITLE)
}

/**
 * @param {Logger} log
 * @param {Date} requestStart
 * @param {Object} options
 * @param {Response} response
 * @param {string} source
 */
function debug (log, requestStart, options, response, source) {
  log.debug({
    duration: new Date() - requestStart,
    statusCode: response.statusCode,
    request: util.inspect(options, true, 5),
    response: util.inspect(response.body, true, 5)
  },
  source
  )
}

module.exports = {
  error,
  debug,
  warn
}
