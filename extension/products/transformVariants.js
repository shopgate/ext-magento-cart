/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
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
 * Gets the characteristics as needed for the shopgate variants from the
 * magento parent product
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
 * Iterates all the shopgate products variants and updates the characteristics
 * to the magento characteristics
 * @param {object[]} shopgateVariants
 * @param {object} characteristics
 */
function updateVariantsByLabelMapping (shopgateVariants, newCharacteristics) {
  const idMap = createIdMap(shopgateVariants.characteristics)
  const labelMap = createLabelMap(newCharacteristics)

  for (let i in shopgateVariants.products) {
    const productCharacteristics = shopgateVariants.products[i].characteristics
    for (let key in productCharacteristics) {
      if (productCharacteristics.hasOwnProperty(key)) {
        const characteristicId = key
        const characteristicValueId = productCharacteristics[key]

        // Get labels of shopgate config (config is characteristic and characteristicValue)
        const labels = idMap[`${characteristicId}-${characteristicValueId}`]
        if (!labels) throw new Error(`can't find labels for shopgate characteristicId "${characteristicId}" and characteristicValueId "${characteristicValueId}"`)

        // Get ids for the former extracted labels in the magento characteristics
        const newConfigurationPair = labelMap[`${labels.characteristicLabel}-${labels.characteristicValueLabel}`]
        if (!newConfigurationPair) throw new Error(`can't find magento characteristicId and characteristicValueId for characteristicLabel "${labels.characteristicLabel}" and characteristicValueLabel "${labels.characteristicValueLabel}"`)

        productCharacteristics[newConfigurationPair.characteristicId] = newConfigurationPair.characteristicValueId
        delete productCharacteristics[key]
      }
    }
  }
}

/**
 * Creates a map where keys are `${characteristicId}-${characteristicValueId}`
 * and values are the {characteristicLabel, characteristicValueLabel}
 * @param {object[]} shopgateCharacteristics
 */
function createIdMap (shopgateCharacteristics) {
  const map = {}

  for (let i in shopgateCharacteristics) {
    for (let j in shopgateCharacteristics[i].values) {
      const characteristicId = shopgateCharacteristics[i].id
      const characteristicValueId = shopgateCharacteristics[i].values[j].id

      // TODO: test if one is missing
      map[`${characteristicId}-${characteristicValueId}`] = {
        characteristicLabel: shopgateCharacteristics[i].label,
        characteristicValueLabel: shopgateCharacteristics[i].values[j].label
      }
    }
  }

  return map
}

/**
 * Creates a map where keys are `${characteristicLabel>}-${characteristicValueLabel}`
 * and values are the {characteristicId, characteristicValueId}
 * @param {*} newCharacteristics
 */
function createLabelMap (newCharacteristics) {
  const map = {}

  for (let i in newCharacteristics) {
    for (let j in newCharacteristics[i].values) {
      const characteristicLabel = newCharacteristics[i].label
      const characteristicValueLabel = newCharacteristics[i].values[j].label

      // TODO: test if one is missing
      map[`${characteristicLabel}-${characteristicValueLabel}`] = {
        characteristicId: newCharacteristics[i].id,
        characteristicValueId: newCharacteristics[i].values[j].id
      }
    }
  }

  return map
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
