const rewire = require('rewire')
const step = rewire('../../../cart/createCartIfNecessary')
const assert = require('assert')

describe('createCartIfNecessary', () => {
  const input = {
    tokens: {
      accessToken: 'a1'
    }
  }

  let request = null

  const context = {
    storage: {
      device: null
    },
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'wowCool'
    },
    log: {
      debug: () => {
      },
      error: () => {
      }
    }
  }

  beforeEach(() => {
    request = {
      post: () => {
      }
    }

    context.storage.device = {
      get: () => {
      },
      set: () => {
      }
    }
    context.meta = {}
  })

  describe('step', () => {
    it('should get the cart id from device storage', (done) => {
      context.storage.device.get = (key, cb) => cb(null, 'cId1')

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.equal(result.cartId, 'cId1')
        done()
      })
    })

    it('should return an error from device storage', (done) => {
      context.storage.device.get = (key, cb) => cb(new Error('error'))

      step(context, input, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should crate a cart via magento and save the id to storage', (done) => {
      context.storage.device.get = (key, cb) => cb()
      context.storage.device.set = (key, value, cb) => cb()

      request.post = (options, cb) => {
        const weirdResponse = {cartId: 'cId1'}
        cb(null, {statusCode: 200}, weirdResponse)
      }

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.equal(result.cartId, 'cId1')
        done()
      })
    })

    it('should return an error from magento', (done) => {
      context.storage.device.get = (key, cb) => cb()

      request.post = (options, cb) => {
        cb(new Error('error'))
      }

      step(context, input, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should return an error after trying to save to device storage', (done) => {
      context.storage.device.get = (key, cb) => cb()
      context.storage.device.set = (key, value, cb) => cb(new Error('error'))

      request.post = (options, cb) => {
        const weirdResponse = {success: [{cartId: 'cId1'}]}
        cb(null, {statusCode: 200}, weirdResponse)
      }

      step(context, input, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should return a "me" cartId as the user is already logged in', (done) => {
      context.meta.userId = 1234

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.equal(result.cartId, 'me')
        done()
      })
    })
  })

  describe('createCart', () => {
    const createCart = step.__get__('createCart')

    it('should return an error because the return code is >= 400', (done) => {
      request.post = (options, cb) => {
        cb(null, {statusCode: 400}, {error: 'error'})
      }

      createCart(context.tracedRequest, input.tokens.accessToken, context.config.magentoUrl, context.log, (err) => {
        assert.equal(err.constructor.name, 'MagentoEndpointError')
        assert.equal(err.message, 'An internal error occurred.')
        assert.equal(err.code, 'EINTERNAL')
        done()
      })
    })
  })
})
