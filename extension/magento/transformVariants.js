module.exports = function (context, input, cb) {
  const shopgateVariants = input.shopgateVariants
  const magentoParentProduct = input.magentoParentProduct

  const newCharacteristics = getNewCharacteristics(shopgateVariants, magentoParentProduct)

  updateVariantsByLabelMapping(shopgateVariants, newCharacteristics)

  cb(null, {products: shopgateVariants.products, characteristics: newCharacteristics})
}

/**
 * @param {*} shopgateVariantsCharacteristics
 * @param {*} magentoParentProduct
 */
function getNewCharacteristics (shopgateVariantsCharacteristics, magentoParentProduct) {
  const characteristics = []

  const attributes = magentoParentProduct.children.attributes
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const attribute = attributes[key]
      const characteristic = new Characteristic(attribute.id, attribute.label)

      for (let key in attribute.options) {
        characteristic.addValue(attribute.options[key].id, attribute.options[key].label)
      }

      characteristics.push(characteristic)
    }
  }

  return characteristics
}

/**
 * Iterates all the products variants and updates the characteristics to the
 * magento characteristics
 * @param {*} shopgateVariants
 * @param {*} characteristics
 */
function updateVariantsByLabelMapping (shopgateVariants, characteristics) {
  for (let i in shopgateVariants.products) {
    for (var key in shopgateVariants.products[i].characteristics) {
      if (shopgateVariants.products[i].characteristics.hasOwnProperty(key)) {
        const characteristicId = key
        const characteristicValueId = shopgateVariants.products[i].characteristics[key]
        const labels = getLabelsForOldConfigurationPair(characteristicId, characteristicValueId, shopgateVariants.characteristics)
        const newConfigurationPair = getConfigurationPairForLabels(labels.characteristicLabel, labels.characteristicValueLabel, characteristics)
        shopgateVariants.products[i].characteristics[newConfigurationPair.characteristicId] = newConfigurationPair.characteristicValueId
        delete shopgateVariants.products[i].characteristics[key]
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
 * It is expected, that the labels are equal in magento parent and the shopgate variants
 * @param {string} characteristicLabel
 * @param {string} characteristicValueLabel
 * @param {Characteristic[]} newCharacteristic
 */
function getConfigurationPairForLabels (characteristicLabel, characteristicValueLabel, newCharacteristic) {
  for (let i in newCharacteristic) {
    if (characteristicLabel === newCharacteristic[i].label) {
      for (let j in newCharacteristic[i].values) {
        if (characteristicValueLabel === newCharacteristic[i].values[j].label) {
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
