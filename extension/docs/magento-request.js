/**
 * @typedef {Object} MagentoRequestUpdateItem
 * @property {string} cartItemId - cart item id as it is in magento database
 * @property {MagentoRequestProductUpdate} product
 */
/**
 * @typedef {Object} MagentoRequestProductUpdate
 * @property {string} product_id - product id as it is in magento database
 * @property {string} qty - new quantity of the product to update to
 */
