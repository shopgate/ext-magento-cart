/**
 * @typedef {Object} StepContext
 * @property {Logger} log - allows logging information to the backend console
 * @property {StepContextConfig} config - Configuration file, reference config.json for values
 * @property {Request} tracedRequest - Request class allows making external REST calls
 * @property {StepContextMeta} meta
 * @property {[StepStorage]} storage - defines different types of storage's to save intermediate data to
 */
/**
 * @typedef {Object} StepStorage
 * @function get
 * @function set
 */
/**
 * @typedef {Object} StepContextConfig
 * @property {string} magentoUrl
 */
/**
 * @typedef {Object} StepContextMeta
 * @property {(string|null)} userId
 */
/**
 * @callback StepCallback
 * @param {?Error} error - an error that can be passed to the callback
 * @param {?Object} result - a valid json key/value to return to the pipeline
 */
