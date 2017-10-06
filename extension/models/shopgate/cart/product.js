class Product {
  constructor (id, name, featuredImageUrl, price) {
    this.id = id
    this.name = name
    this.featuredImageUrl = featuredImageUrl
    this.price = price
    this.additionalInfo = []
    this.properties = []
    this.appliedDiscounts = []
  }

  addAdditionalInfo (additionalInfo) {
    this.additionalInfo.push(additionalInfo)
  }

  addProperty (property) {
    this.properties.push(property)
  }

  addAppliedDiscount (appliedDiscount) {
    this.appliedDiscounts.push(appliedDiscount)
  }
}

module.exports = Product
