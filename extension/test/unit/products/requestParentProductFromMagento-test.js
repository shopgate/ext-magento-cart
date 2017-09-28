const rewire = require('rewire')
const step = rewire('../../../products/requestParentProductFromMagento')
const assert = require('assert')

function copy (stringifyable) {
  return JSON.parse(JSON.stringify(stringifyable))
}

describe('requestParentProductFromMagento', () => {
  const input = {
    productId: 'testProduct'
  }

  let context = null

  beforeEach(() => {
    context = {
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
          get: () => {},
          set: () => {}
        }
      },
      log: {
        debug: () => {}
      },
      tracedRequest: () => {}
    }
  })

  describe('step', () => {
    it('should get a parent product from magento', (done) => {
      const magentoProduct = copy(require('../data/magento-configurable-product.json'))
      context.storage.extension.get = (key, cb) => {
        cb(null, {accessToken: 'at'})
      }

      context.tracedRequest = () => {
        return {
          get: (options, cb) => {
            cb(null, {statusCode: 200}, magentoProduct)
          }
        }
      }

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result.product, magentoProduct)
        done()
      })
    })

    it('should return an error because can not get tokens', (done) => {
      context.storage.extension.get = (key, cb) => {
        cb(new Error('error'))
      }

      step(context, input, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should return an error because first requestParentProductFromMagento fails', (done) => {
      context.storage.extension.get = (key, cb) => {
        cb(null, {accessToken: 'at'})
      }

      context.tracedRequest = () => {
        return {
          get: (options, cb) => {
            cb(new Error('error'))
          }
        }
      }

      step(context, input, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should return a product after receiving a token from magento', (done) => {
      const magentoProduct = copy(require('../data/magento-configurable-product.json'))

      context.storage.extension.get = (key, cb) => {
        cb(null, {accessToken: 'at'})
      }

      context.storage.extension.set = (key, value, cb) => {
        cb(null)
      }

      let next = false
      context.tracedRequest = () => {
        return {
          get: (options, cb) => {
            if (!next) {
              next = true
              cb(new Error('Got error (401)'))
            } else {
              cb(null, {statusCode: 200}, magentoProduct)
            }
          },
          post: (options, cb) => {
            cb(null, {statusCode: 200}, {success: [{access_token: 'accessToken'}]})
          }
        }
      }

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result.product, magentoProduct)
        done()
      })
    })

    it('should return an error after attemt to receive a token from magento', (done) => {
      const magentoProduct = copy(require('../data/magento-configurable-product.json'))

      context.storage.extension.get = (key, cb) => {
        cb(null, {accessToken: 'at'})
      }

      let next = false
      context.tracedRequest = () => {
        return {
          get: (options, cb) => {
            if (!next) {
              next = true
              cb(new Error('Got error (401)'))
            } else {
              cb(null, {statusCode: 200}, magentoProduct)
            }
          },
          post: (options, cb) => {
            cb(new Error('error'))
          }
        }
      }

      step(context, input, (err, result) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should return an error after attemt to get a product from magento a second time', (done) => {
      context.storage.extension.get = (key, cb) => {
        cb(null, {accessToken: 'at'})
      }

      context.storage.extension.set = (key, value, cb) => {
        cb(null)
      }

      let next = false
      context.tracedRequest = () => {
        return {
          get: (options, cb) => {
            if (!next) {
              next = true
              cb(new Error('Got error (401)'))
            } else {
              cb(new Error('error'))
            }
          },
          post: (options, cb) => {
            cb(null, {statusCode: 200}, {success: [{access_token: 'accessToken'}]})
          }
        }
      }

      step(context, input, (err, result) => {
        assert.equal(err.message, 'error')
        done()
      })
    })
  })

  describe('requestParentProductFromMagento', () => {
    const requestParentProductFromMagento = step.__get__('requestParentProductFromMagento')

    it('should return an error because the magento response status code is >= 400', (done) => {
      context.tracedRequest = () => {
        return {
          get: (options, cb) => {
            cb(null, {statusCode: 401}, {message: 'unauthorized'})
          }
        }
      }

      requestParentProductFromMagento(context.tracedRequest, input.productId, 'at', context.config.productUrl, context.log, (err) => {
        assert.equal(err.message, 'Got error (401) from magento: {"message":"unauthorized"}')
        done()
      })
    })
  })
})
