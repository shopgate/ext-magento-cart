const assert = require('assert')
const step = require('../../../cart/addProductsToCart')

describe('addProductsToCart', () => {
  let request = null

  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'greatWow'
    },
    log: {
      debug: () => {}
    },
    meta: {}
  }

  const input = {
    tokens: {
      accessToken: 'a1'
    },
    transformedProducts: [
      {
        'product_id': '1',
        'qty': 1
      }
    ],
    cartId: 1234
  }

  beforeEach(() => {
    request = {
      post: () => {}
    }
  })

  it('should add products to cart', (done) => {
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 200}, {foo: 'bar'})
      }
    }

    step(context, input, (err) => {
      assert.ifError(err)
      done()
    })
  })

  it('should return an error because of the request', (done) => {
    request = {
      post: (options, cb) => {
        cb(new Error('error'))
      }
    }

    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because the statusCode of the resonse is >= 400', (done) => {
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 400}, {foo: 'bar'})
      }
    }

    step(context, input, (err) => {
      assert.equal(err.message, 'Got 400 from magento: {"foo":"bar"}')
      done()
    })
  })
})
