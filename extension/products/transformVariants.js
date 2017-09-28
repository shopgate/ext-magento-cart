/**
 * @param {object} context
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  // TODO: input validation
  const shopgateVariants = {products: input.products, characteristics: input.characteristics}
  const magentoParentProduct = input.magentoParentProduct

  const newCharacteristics = getNewCharacteristics(magentoParentProduct)

  try {
    updateVariantsByLabelMapping(shopgateVariants, newCharacteristics)
  } catch (err) {
    cb(err)
  }

  cb(null, {products: shopgateVariants.products, characteristics: newCharacteristics})
}

/**
 * @param {object} magentoParentProduct
 */
function getNewCharacteristics (magentoParentProduct) {
  const characteristics = []
  const attributes = magentoParentProduct.children.attributes
  for (let aKey in attributes) {
    if (attributes.hasOwnProperty(aKey)) {
      const attribute = attributes[aKey]
      const characteristic = new Characteristic(attribute.id, attribute.label)

      for (let oKey in attribute.options) {
        const options = attribute.options[oKey]
        characteristic.addValue(options.id, options.label)
      }

      characteristics.push(characteristic)
    }
  }

  return characteristics
}

/**
 * Iterates all the products variants and updates the characteristics to the
 * magento characteristics
 * @param {object[]} shopgateVariants
 * @param {object} characteristics
 */
function updateVariantsByLabelMapping (shopgateVariants, newCharacteristics) {
  for (let i in shopgateVariants.products) {
    const characteristics = shopgateVariants.products[i].characteristics
    for (let key in characteristics) {
      if (characteristics.hasOwnProperty(key)) {
        const characteristicId = key
        const characteristicValueId = characteristics[key]

        // Get labels of shopgate config (config is characteristic and characteristicValue)
        const labels = getLabelsForOldConfigurationPair(characteristicId, characteristicValueId, shopgateVariants.characteristics)
        if (!labels) throw new Error(`can't find labels for shopgate characteristicId "${characteristicId}" and characteristicValueId "${characteristicValueId}"`)

        // Get ids for the former extracted labels in the magento characteristics
        const newConfigurationPair = getConfigurationPairForLabels(labels.characteristicLabel, labels.characteristicValueLabel, newCharacteristics)
        if (!newConfigurationPair) throw new Error(`can't find magento characteristicId and characteristicValueId for characteristicLabel "${labels.characteristicLabel}" and characteristicValueLabel "${labels.characteristicValueLabel}"`)

        characteristics[newConfigurationPair.characteristicId] = newConfigurationPair.characteristicValueId
        delete characteristics[key]
      }
    }
  }
}

/**
 * Retruns the labels for a shopgate variant configurations (characteristicId, characteristicValueId)
 * It is expected, that the labels are equal in magento parent and the shopgate variants
 * @param {string} characteristicId
 * @param {string} characteristicValueId
 * @param {Characteristic[]} oldCharacteristics
 */
function getLabelsForOldConfigurationPair (characteristicId, characteristicValueId, oldCharacteristics) {
  for (let i in oldCharacteristics) {
    if (characteristicId === oldCharacteristics[i].id) {
      for (let j in oldCharacteristics[i].values) {
        if (characteristicValueId === oldCharacteristics[i].values[j].id) {
          // TODO: test if one is missing (in this case return null)
          return {
            characteristicLabel: oldCharacteristics[i].label,
            characteristicValueLabel: oldCharacteristics[i].values[j].label
          }
        }
      }
    }
  }
}

/**
 * It is expected, that the labels are equal in the magento parent and the shopgate variants
 * @param {string} characteristicLabel
 * @param {string} characteristicValueLabel
 * @param {Characteristic[]} newCharacteristic
 */
function getConfigurationPairForLabels (characteristicLabel, characteristicValueLabel, newCharacteristic) {
  for (let i in newCharacteristic) {
    if (characteristicLabel.toLocaleLowerCase() === newCharacteristic[i].label.toLocaleLowerCase()) {
      for (let j in newCharacteristic[i].values) {
        if (characteristicValueLabel.toLowerCase() === newCharacteristic[i].values[j].label.toLowerCase()) {
          // TODO: test if one is missing (in this case return null)
          return {
            characteristicId: newCharacteristic[i].id,
            characteristicValueId: newCharacteristic[i].values[j].id
          }
        }
      }
    }
  }
}

class Characteristic {
  /**
   * @param {string} id of the characteristic
   * @param {string} label of the characteristic
   */
  constructor (id, label) {
    this.id = id
    this.label = label
    this.values = []
  }

  addValue (id, label) {
    this.values.push(new CharacteristicValue(id, label))
  }
}

class CharacteristicValue {
  /**
   * @param {string} id of the characteristic value
   * @param {string} label of the characteristic value
   */
  constructor (id, label) {
    this.id = id
    this.label = label
  }
}
