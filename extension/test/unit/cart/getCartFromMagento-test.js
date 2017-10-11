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
    }
  }

  const input = {
    tokens: {
      accessToken: 'a1'
    },
    cartId: 'c1'
  }

  beforeEach(() => {
    request = {
      get: () => {}
    }
  })

  it('should get a cart from magento', (done) => {
    const cart = {cart: 'cart'}
    request.get = (options, cb) => {
      cb(null, {statusCode: 200}, cart)
    }

    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result.magentoCart, cart)
      done()
    })
  })

  it('should return an error because of the request', (done) => {
    request.get = (options, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because of status code >= 400', (done) => {
    request.get = (options, cb) => {
      cb(null, {statusCode: 499}, {message: 'mimimi'})
    }

    step(context, input, (err) => {
      assert.equal(err.message, 'Got 499 from magento: {"message":"mimimi"}')
      done()
    })
  })
})
