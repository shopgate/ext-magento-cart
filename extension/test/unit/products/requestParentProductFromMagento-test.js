const rewire = require('rewire')
const step = rewire('../../../products/requestParentProductFromMagento')
const assert = require('assert')

function copy (stringifyable) {
  return JSON.parse(JSON.stringify(stringifyable))
}

describe('requestParentProductFromMagento', () => {
  let request = null

  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      authUrl: 'http://authUrl.com/auth',
      productUrl: 'http://productUrl.com/product',
      credentials: {
        id: 'testId',
        secret: 'testSecret'
      }
    },
    storage: {
      extension: {
        get: () => {
        },
        set: () => {
        }
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
    productId: 'testProduct',
    tokens: {
      accessToken: 'at'
    }
  }
  beforeEach(() => {
    request = {
      get: () => {
      }
    }
  })

  describe('testing the whole step', () => {
    it('should get a parent product from magento', (done) => {
      const magentoProduct = copy(require('../data/magento-configurable-product.json'))

      request = {
        get: (options, cb) => {
          cb(null, {statusCode: 200}, magentoProduct)
        }
      }

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result.product, magentoProduct)
        done()
      })
    })

    it('should return an error because requestParentProductFromMagento fails', (done) => {
      request = {
        get: (options, cb) => {
          cb(new Error('error'))
        }
      }

      step(context, input, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })
  })

  describe('directly testing the function', () => {
    const requestParentProductFromMagento = step.__get__('requestParentProductFromMagento')

    it('should return an error because the magento response status code is >= 400', (done) => {
      context.tracedRequest.get = (options, cb) => {
          cb(null, {statusCode: 401}, {message: 'unauthorized'})
        }


      requestParentProductFromMagento(context.tracedRequest, input.productId, 'at', context.config.productUrl, context.log, null, (err) => {
        assert.equal(err.message, 'An internal error occurred.')
        assert.equal(err.constructor.name, 'MagentoEndpointError')
        assert.equal(err.code, 'EINTERNAL')
        done()
      })
    })
  })
})
