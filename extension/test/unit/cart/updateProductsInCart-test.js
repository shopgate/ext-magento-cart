const assert = require('assert')
const step = require('../../../cart/updateProductsInCart')

function copy (stringifyable) {
  return JSON.parse(JSON.stringify(stringifyable))
}

describe('updateProductsInCart', () => {
  const request = {
    post: null
  }

  /** @var {StepContext} */
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
    },
    log: {
      debug: () => {
      },
      error: () => {
      }
    }
  }

  /** @var {UpdateProductsInCartInput} */
  const input = {
    CartItem: [{
      CartItemId: 'cartItem1',
      quantity: 2
    }],
    token: 'a1',
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
        baseUrl: 'http://some.url/carts',
        uri: input.cartId + '/items',
        auth: {
          bearer: input.token
        },
        json: [
          {
            cartItemId: 'cartItem1',
            product: {
              product_id: 'simple1',
              qty: 2
            }
          }
        ],
        rejectUnauthorized: true
      }

      assert.deepEqual(o, options)
      cb(null, { statusCode: 200, body: {} })
    }

    step(context, input, (err) => {
      assert.ifError(err)
      done()
    })
  })

  it('should return an error because cart id missing', (done) => {
    input.cartId = null

    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'InvalidCallError')
      assert.equal(err.code, 'EINVALIDCALL')
      done()
    })
  })

  it('should return an error because storage fails', (done) => {
    context.storage.device.get = (key, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because storage returns nothing', (done) => {
    context.storage.device.get = (key, cb) => {
      cb()
    }

    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'InvalidCallError')
      assert.equal(err.code, 'EINVALIDCALL')
      done()
    })
  })

  it('should return an error because cartId is invalid', (done) => {
    input.cartId = 2

    context.storage.device.get = (key, cb) => {
      cb(null, copy(require('../data/magento-cart.json')))
    }

    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'InvalidCallError')
      assert.equal(err.code, 'EINVALIDCALL')
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

    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because magento call fails (2)', (done) => {
    context.storage.device.get = (key, cb) => {
      cb(null, copy(require('../data/magento-cart.json')))
    }

    request.post = (options, cb) => {
      cb(null, { statusCode: 456, body: { foo: 'bar' } })
    }

    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })
})
