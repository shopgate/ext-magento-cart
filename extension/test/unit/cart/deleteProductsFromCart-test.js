const assert = require('assert')
const step = require('../../../cart/deleteProductsFromCart')

describe('deleteProductsFromCart', () => {
  const request = {
    delete: null
  }

  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://some.url'
    }
  }

  const input = {
    token: 'a1',
    cartId: 'c1',
    cartItemIds: ['ci1', 'ci2']
  }

  beforeEach(() => {
    request.delete = () => {}
  })

  it('should delete products from the cart', (done) => {
    request.delete = (options, cb) => {
      cb(null, {statusCode: 200}, {})
    }

    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result, {})
      done()
    })
  })

  it('should return an error because the request failed', (done) => {
    request.delete = (options, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because the status code is not 200', (done) => {
    request.delete = (options, cb) => {
      cb(null, {statusCode: 456}, {foo: 'bar'})
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'Got 456 from magento: {"foo":"bar"}')
      done()
    })
  })
})
