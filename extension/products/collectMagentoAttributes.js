/**
 * Takes an attribute and a list of possible attributes for the parent and returns the selection, that is required
 *
 * @param variantId
 * @param attributes
 */
module.exports = (variantId, attributes) => {
  const selectedAttributes = []
  let i, optionIndex, option

  // iterate through all attributes
  for (let attributeIndex in attributes) {
    // find the currently selected option for every attibute
    if (attributes.hasOwnProperty(attributeIndex)) {
      for (optionIndex = 0; optionIndex < attributes[attributeIndex].options.length; optionIndex++) {
        option = attributes[attributeIndex].options[optionIndex]
        for (i = 0; i < option.products.length; i++) {
          if (option.products[i] === variantId) {
            // found the selected one, append to list
            selectedAttributes.push({attributeId: attributes[attributeIndex].id, optionId: option.id})

            // skip the rest of the options, because every variant can have only one option selected, per attribute
            optionIndex = attributes[attributeIndex].options.length
            break
          }
        }
      }
    }
  }

  return selectedAttributes
}
