class AppliedDiscount {
  constructor (savedPrice, type) {
    this.savedPrice = {}
    this.savedPrice.value = savedPrice
    this.savedPrice.type = type
    this.code = null
    this.description = null
    this.label = null
  }

  setCode (code) {
    this.code = code
  }

  setDescription (description) {
    this.description = description
  }

  setLabel (label) {
    this.label = label
  }
}

module.exports = AppliedDiscount
