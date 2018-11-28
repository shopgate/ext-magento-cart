const rewire = require('rewire')
const step = rewire('../../../cart/createCartIfNecessary')
const assert = require('assert')
const request = require('request')
const nock = require('nock')

describe('createCartIfNecessary', () => {
  const input = {
    tokens: {
      accessToken: 'a1'
    }
  }

  const context = {
    storage: {
      device: null
    },
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://magento.shopgate.com'
    },
    log: {
      debug: () => {
      },
      error: () => {
      }
    }
  }

  beforeEach(() => {
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
        assert.strictEqual(result.cartId, 'cId1')
        done()
      })
    })

    it('should return an error from device storage', (done) => {
      context.storage.device.get = (key, cb) => cb(new Error('error'))

      step(context, input, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })

    it('should create a cart via magento and save the id to storage', (done) => {
      context.storage.device.get = (key, cb) => cb()
      context.storage.device.set = (key, value, cb) => cb()

      nock(context.config.magentoUrl).post('/carts').reply(200, { cartId: 'cId1' })

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.strictEqual(result.cartId, 'cId1')
        done()
      })
    })

    it('should return an error from magento', (done) => {
      context.storage.device.get = (key, cb) => cb()

      nock(context.config.magentoUrl).post('/carts').replyWithError('error')

      step(context, input, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })

    it('should return an error after trying to save to device storage', (done) => {
      context.storage.device.get = (key, cb) => cb()
      context.storage.device.set = (key, value, cb) => cb(new Error('error'))

      nock(context.config.magentoUrl).post('/carts').reply(200, { success: [{ cartId: 'cId1' }] })

      step(context, input, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })

    it('should return a "me" cartId as the user is already logged in', (done) => {
      context.meta.userId = 1234

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.strictEqual(result.cartId, 'me')
        done()
      })
    })
  })

  describe('createCart', () => {
    const createCart = step.__get__('createCart')

    it('should return an error because the return code is >= 400', (done) => {
      context.tracedRequest.post = (options, cb) => {
        cb(null, { statusCode: 400 }, { error: 'error' })
      }

      createCart(context.tracedRequest, input.tokens.accessToken, context.config.magentoUrl, context.log, null, (err) => {
        assert.strictEqual(err.constructor.name, 'MagentoEndpointError')
        assert.strictEqual(err.code, 'EINTERNAL')
        done()
      })
    })
  })
})
