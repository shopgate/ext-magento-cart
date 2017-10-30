const assert = require('assert')
const step = require('../../../cart/updateProductsInCart')

function copy (stringifyable) {
  return JSON.parse(JSON.stringify(stringifyable))
}

describe('updateProductsInCart', () => {
  const request = {
    post: null
  }

  const context = {
    tracedRequest: () => {
      return request
    },
    meta: {
      userId: null
    },
    config: {
      magentoUrl: 'http://some.url'
    },
    storage: {
      user: {
        get: null
      },
      device: {
        get: null
      }
    }
  }

  const input = {
    CartItem: [{
      CartItemId: 'cartItem1',
      quantity: 2
    }],
    accessToken: 'a1',
    cartId: null
  }

  beforeEach(() => {
    request.post = () => {}
    context.meta.userId = null
    context.storage.device.get = () => {}
    context.storage.user.get = () => {}
    input.cartId = 1
  })

  it('should update a product in cart', (done) => {
    context.storage.device.get = (key, cb) => {
      cb(null, copy(require('../data/magento-cart.json')))
    }

    request.post = (options, cb) => {
      const o = {
        url: 'http://some.url/carts/1/items',
        headers: { authorization: 'Bearer undefined' },
        json: [
          {
            cartItemId: 'cartItem1',
            product: {
              product_id: 'simple1',
              qty: 2
            }
          }
        ]
      }

      assert.deepEqual(o, options)
      cb(null, {statusCode: 200}, {})
    }

    step(context, input, (err, result) => {
      assert.ifError(err)
      done()
    })
  })

  it('should return an error because cart id missing', (done) => {
    input.cartId = null

    step(context, input, (err, result) => {
      assert.equal(err.message, 'cart id missing')
      done()
    })
  })

  it('should return an error because storage fails', (done) => {
    context.storage.device.get = (key, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because storage returns nothing', (done) => {
    context.storage.device.get = (key, cb) => {
      cb(null, null)
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'missing cart information')
      done()
    })
  })

  it('should return an error because cartId is invalid', (done) => {
    input.cartId = 2

    context.storage.device.get = (key, cb) => {
      cb(null, copy(require('../data/magento-cart.json')))
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'invalid cart')
      done()
    })
  })

  it('should return an error because magento call fails', (done) => {
    context.storage.device.get = (key, cb) => {
      cb(null, copy(require('../data/magento-cart.json')))
    }

    request.post = (options, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because magento call fails (2)', (done) => {
    context.storage.device.get = (key, cb) => {
      cb(null, copy(require('../data/magento-cart.json')))
    }

    request.post = (options, cb) => {
      cb(null, {statusCode: 456}, {foo: 'bar'})
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'Got 456 from magento: {"foo":"bar"}')
      done()
    })
  })
})
