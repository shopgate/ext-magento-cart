const assert = require('assert')
const step = require('../../../cart/setCartCustomer_v1')

describe('testing assigning guest cart to customer cart', () => {
  let request = null
  let errorMessage = 'Some error message'

  /** @var {StepContext} */
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
    ]
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
    input.cartId = 1234
  })

  it('having an empty cart returns no error', (done) => {
    input.cartId = null

    step(context, input, (err) => {
      assert.ifError(err)
      done()
    })
  })

  it('testing successful return produces no errors', (done) => {
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

  it('should return an error because of an erroneous request', (done) => {
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

  it('should return an MagentoEndpointError because the statusCode of the response is != 200', (done) => {
    request = {
      post: (options, cb) => {
        cb(null, {statusCode: 500}, mageErrorResponse)
      }
    }

    step(context, input, (err) => {
      assert.equal(err.message, 'An internal error occurred.')
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })
})
