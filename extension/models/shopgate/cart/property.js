class Property {
  constructor (type, value) {
    this.type = type
    this.value = value
    this.label = null
  }

  setLabel (label) {
    this.label = label
  }
}

module.exports = Property
