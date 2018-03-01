const assert = require('assert')
const step = require('../../../cart/getCartFromMagento')

describe('getCartFromMagento', () => {
  let request = null

  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://someUrl'
    },
    meta: {
      userId: null
    },
    storage: {
      device: {
        get: null,
        set: null
      },
      user: {
        set: null,
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

  const input = {
    tokens: {
      accessToken: 'a1'
    }
  }

  beforeEach(() => {
    request = {
      get: () => {
      }
    }
    context.meta.userId = null
    context.storage.device.set = () => {
    }
    context.storage.user.set = () => {
    }
    input.cartId = 'me'
  })

  it('should get a cart from magento', (done) => {
    const cart = {cart: 'cart'}
    request.get = (options, cb) => {
      cb(null, {statusCode: 200}, cart)
    }

    context.storage.device.set = (key, value, cb) => {
      cb()
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result.magentoCart, cart)
      done()
    })
  })

  it('no order id passed inside the input should produce an error', (done) => {
    input.cartId = null

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'Output key "cartId" is missing')
      done()
    })
  })

  it('should return an error because of the request', (done) => {
    request.get = (options, cb) => {
      cb(new Error('error'))
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because of status code >= 400', (done) => {
    request.get = (options, cb) => {
      cb(null, {statusCode: 499}, {message: 'mimimi'})
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'An internal error occurred.')
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      done()
    })
  })

  it('should return an error because setting cart in storage fails', (done) => {
    const cart = {cart: 'cart'}
    request.get = (options, cb) => {
      cb(null, {statusCode: 200}, cart)
    }

    context.storage.device.set = (key, value, cb) => {
      cb(new Error('error'))
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })
})
