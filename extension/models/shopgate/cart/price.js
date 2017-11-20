class Price {
  constructor (unit, defaultValue, special) {
    this.unit = unit
    this.default = defaultValue
    this.special = special
  }
  /**
   * @param int value
   */
  setUnit (value) {
    this.unit = value
  }
  /**
   * @param int value
   */
  setDefaultValue (value) {
    this.default = value
  }
  /**
   * @param int value
   */
  setSpecial (value) {
    this.special = value
  }
}

module.exports = Price
