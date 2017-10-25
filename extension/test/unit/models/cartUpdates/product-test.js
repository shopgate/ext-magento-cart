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

    assert.deepEqual(result, product)
    done()
  })

  it('should transform to a simple product item', (done) => {
    const product = new Product('cartItemId', 'productId', 1)

    const result = {
      cartItemId: 'cartItemId',
      product: {
        productId: 'productId',
        qty: 1
      }
    }

    assert.deepEqual(product.transformToUpdateProductItem(), result)
    done()
  })

  it('should throw an error because a configurable product is not supported yet', (done) => {
    const product = new Product('cartItemId', 'productId', 1, 'whoa')

    assert.throws(() => {
      product.transformToUpdateProductItem()
    })

    done()
  })
})
