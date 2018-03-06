const assert = require('assert')
const step = require('../../../cart/addCartItems')

describe('addCartItems', () => {
  let request = null
  let errorMessage = 'Some error message'

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
    meta: {}
  }

  const input = {
    tokens: {
      accessToken: 'a1'
    },
    transformedItems: [
      {
        'product_id': '1',
        'qty': 1
      }
    ],
    cartId: 1234
  }

  const mageErrorResponse = {
    messages: {
      error: [
        {
          message: errorMessage
        }
      ]
    }
  }

  beforeEach(() => {
    request = {
      post: () => {
      }
    }
  })

  it('should add products to cart', (done) => {
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 200}, {foo: 'bar'})
      }
    }

    // noinspection JSCheckFunctionSignatures
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

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('unknown error structure returned by Magento should produce an empty result', (done) => {
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 400}, {foo: 'bar'})
      }
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, '')
      done()
    })
  })

  it('should return an InvalidItemError because the statusCode of the response is >= 400 && < 500', (done) => {
    let errorMessage = 'Some error message'
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 400}, mageErrorResponse
        )
      }
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, errorMessage)
      assert.equal(err.constructor.name, 'InvalidItemError')
      done()
    })
  })

  it('should return an MagentoEndpointError because the statusCode of the response is != 200 && >= 500', (done) => {
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 500}, mageErrorResponse)
      }
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })
})
