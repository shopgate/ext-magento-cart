const assert = require('assert')
const step = require('../../../cart/deleteItemsFromCart')

describe('deleteItemsFromCart', () => {
  const request = {
    delete: null
  }

  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://some.url'
    },
    log: {
      debug: () => {
      },
      error: () => {
      }
    }
  }

  const input = {
    token: 'a1',
    cartItemIds: ['ci1', 'ci2']
  }

  beforeEach(() => {
    request.delete = () => {
    }
    input.cartId = 'c1'
  })

  it('should delete products from the cart', (done) => {
    request.delete = (options, cb) => {
      cb(null, { statusCode: 200 }, {})
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result, {})
      done()
    })
  })

  it('no order id passed inside the input should produce an error', (done) => {
    input.cartId = null

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'InvalidCallError')
      assert.equal(err.code, 'EINVALIDCALL')
      done()
    })
  })

  it('should return an error because the request failed', (done) => {
    request.delete = (options, cb) => {
      cb(new Error('error'))
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because the status code is not 200', (done) => {
    request.delete = (options, cb) => {
      cb(null, { statusCode: 456 }, { foo: 'bar' })
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })
})
