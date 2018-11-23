const assert = require('assert')
const step = require('../../../cart/getCartFromMagento')
const request = require('request')
const nock = require('nock')

describe('getCartFromMagento', () => {
  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://magento.shopgate.com'
    },
    meta: {
      userId: null
    },
    storage: {
      device: {
        get: null,
        set: null
      },
      user: {
        set: null,
        get: null
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
    token: 'at'
  }

  beforeEach(() => {
    context.meta.userId = null
    context.storage.device.set = () => {
    }
    context.storage.user.set = () => {
    }
    input.cartId = 'me'
  })

  it('should get a cart from magento', (done) => {
    nock(context.config.magentoUrl).get('/carts/me').reply(200, { cart: 'cart' })

    context.storage.device.set = (key, value, cb) => {
      cb()
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result.magentoCart, { cart: 'cart' })
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

  it('should return an error because of the request', (done) => {
    nock(context.config.magentoUrl).get('/carts/me').replyWithError('error')

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because of status code >= 400', (done) => {
    nock(context.config.magentoUrl).get('/carts/me').reply(401, {})

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })

  it('should return an error because setting cart in storage fails', (done) => {
    nock(context.config.magentoUrl).get('/carts/me').reply(200, { cart: 'cart' })

    context.storage.device.set = (key, value, cb) => {
      cb(new Error('An internal error occurred.'))
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'An internal error occurred.')
      done()
    })
  })
})
