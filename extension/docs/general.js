/**
 * @typedef {object} StepContext
 * @property {Logger} log - allows logging information to the backend console
 * @property {StepContextConfig} config - Configuration file, reference config.json for values
 * @property {Request} tracedRequest - Request class allows making external REST calls
 * @property {StepContextMeta} meta
 * @property {Array<StepStorage>} storage - defines different types of storage's to save intermediate data to
 *
 * @typedef {object} StepStorage
 * @function get
 * @function set
 *
 * @typedef {object} StepContextConfig
 * @property {string} magentoUrl
 *
 * @typedef {object} StepContextMeta
 * @property {string} userId
 *
 * @callback StepCallback
 * @param {(Error|null)} error - an error that can be passed to the callback
 * @param {object} result - a valid json key/value to return to the pipeline
 */
