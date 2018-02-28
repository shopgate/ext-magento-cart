class AppliedDiscount {
  constructor (savedPrice) {
    this.savedPrice = savedPrice
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
