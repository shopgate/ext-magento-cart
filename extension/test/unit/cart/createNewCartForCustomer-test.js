const assert = require('assert')
const rewire = require('rewire')
const step = rewire('../../../cart/createNewCartForCustomer')

describe('creating a new cart for customer', () => {
  let request = null

  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'greatWow'
    },
    log: {
      debug: () => {
      },
      error: () => {
      }
    },
    meta: {},
    storage: {
      user: null
    }
  }

  const input = {
    tokens: {
      accessToken: 'a1'
    }
  }

  beforeEach(() => {
    request = {
      post: () => {
      }
    }

    context.storage.user = {
      get: () => {
      },
      set: () => {
      }
    }
    input.orderId = 1234
  })

  it('check that a success response produces no error', (done) => {
    context.storage.user.set = (key, value, cb) => cb(null)
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 200}, {cartId: '12345'})
      }
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.success, true)
      done()
    })
  })

  it('no order id passed inside the input should produce an error', (done) => {
    input.orderId = null

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'Output key "orderId" is missing')
      done()
    })
  })

  it('should return an error because of the request', (done) => {
    request = {
      post: (options, cb) => {
        cb(new Error('error'))
      }
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an MagentoEndpointError because the statusCode of the response is != 200', (done) => {
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 500}, {error: 'some kinda error'})
      }
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'An internal error occurred.')
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      done()
    })
  })

  it('check that a success response without a cartId will produce an endpoint error too', (done) => {
    context.storage.user.set = (key, value, cb) => cb(null)
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 200}, {error: 'some kinda error'})
      }
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'An internal error occurred.')
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      done()
    })
  })
})
