/**
 * Takes a Shopgate-uid and returns the Magento variant id part of it
 *
 * @param $combinedId
 * @return {string}
 */
module.exports = ($combinedId) => {
    const idList = $combinedId.toString().split('-')
    return idList[idList.length - 1]
  }