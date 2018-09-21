const assert = require('assert')
const rewire = require('rewire')
const step = rewire('../../../cart/createNewCartForCustomer')
const request = require('request')
const nock = require('nock')

describe('creating a new cart for customer', () => {
  const context = {
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
    },
    meta: {
      userId: null
    },
    storage: {
      user: null,
      device: null
    }
  }

  const input = {
    token: 'at'
  }

  beforeEach(() => {
    context.storage.user = {
      get: () => {
      },
      set: () => {
      }
    }
    context.storage.device = {
      get: () => {
      },
      set: () => {
      }
    }
    input.orderId = 1234
  })

  it('check that a success response produces for a guest has no error', (done) => {
    context.storage.device.set = (key, value, cb) => cb()
    nock(context.config.magentoUrl).post('/carts').reply(200, {cartId: 123})

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.success, true)
      done()
    })
  })

  it('check that a success response produces for a user has no error', (done) => {
    context.meta.userId = 8
    context.storage.user.set = (key, value, cb) => cb()
    nock(context.config.magentoUrl).post('/carts').reply(200, {cartId: 123})

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.success, true)
      done()
    })
  })

  it('no order id passed inside the input should produce an error', (done) => {
    input.orderId = null

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'InvalidCallError')
      assert.equal(err.code, 'EINVALIDCALL')
      done()
    })
  })

  it('should return an error because of the request', (done) => {
    nock(context.config.magentoUrl).post('/carts').replyWithError('error')

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an MagentoEndpointError because the statusCode of the response is != 200', (done) => {
    nock(context.config.magentoUrl).post('/carts').reply(201, {messages: {error: [{message: 'error'}]}})

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })

  it('check that a success response without a cartId will produce an endpoint error too', (done) => {
    context.storage.user.set = (key, value, cb) => cb()

    nock(context.config.magentoUrl).post('/carts').reply(201, {cartId: 123})

    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })
})
