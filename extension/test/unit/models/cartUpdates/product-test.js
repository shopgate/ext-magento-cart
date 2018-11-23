const assert = require('assert')
const Product = require('../../../../models/cartUpdates/product')

describe('Product (cartUpdates)', () => {
  it('should create a product', (done) => {
    const parentProduct = new Product('parentCartItemId', 'parentProductId')
    const product = new Product('cartItemId', 'productId', 1, parentProduct)

    const result = {
      cartItemId: 'cartItemId',
      productId: 'productId',
      quantity: 1,
      parent: {
        cartItemId: 'parentCartItemId',
        productId: 'parentProductId',
        quantity: undefined,
        parent: undefined
      }
    }

    assert.deepStrictEqual(result, product)
    done()
  })

  it('should transform to a simple product item', (done) => {
    const product = new Product('cartItemId', 'productId', 1)

    const result = {
      cartItemId: 'cartItemId',
      product: {
        'product_id': 'productId',
        qty: 1
      }
    }

    assert.deepStrictEqual(product.transformToUpdateProductItem(), result)
    done()
  })
})
