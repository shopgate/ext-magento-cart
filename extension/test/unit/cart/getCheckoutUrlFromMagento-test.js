const assert = require('assert')
const moment = require('moment')
const step = require('../../../cart/getCheckoutUrlFromMagento')
const request = require('request')
const nock = require('nock')

describe('getCheckoutUrlFromMagento', () => {
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
      },
      warn: () => {
      }
    }
  }

  const input = {
    token: 'a1'
  }

  beforeEach(() => {
    input.cartId = 123
  })

  it('should return the checkout url', (done) => {
    const responseBody = { 'expires_in': 3600, url: 'http://some.url/2/' }
    const params = 'sgcloud_inapp/1/utm_source/shopgate/utm_medium/app/utm_campaign/web-checkout/'

    nock(context.config.magentoUrl).post('/carts/123/checkoutUrl').reply(200, { 'expires_in': 3600, url: 'http://some.url/2/' })

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      const calculatedDate = moment(result.expires, moment.ISO_8601, true)
      assert.ifError(err)
      assert.strictEqual(calculatedDate.isValid(), true)
      assert.strictEqual(result.url, responseBody.url + params)
      done()
    })
  })

  it('should throw an error despite code 200 and if url is not returned', (done) => {
    const responseBody = { 'expires_in': 3600 }

    request.post = (options, cb) => {
      cb(null, { statusCode: 200, body: responseBody })
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.strictEqual(err.constructor.name, 'MagentoEndpointError')
      assert.strictEqual(err.code, 'EINTERNAL')
      done()
    })
  })

  it('should return an error because the request failed (client)', (done) => {
    request.post = (options, cb) => {
      cb(new Error('error'))
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.strictEqual(err.message, 'error')
      done()
    })
  })

  it('should return an error because the request failed (server)', (done) => {
    request.post = (options, cb) => {
      cb(null, { statusCode: 456, body: { foo: 'bar' } })
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.strictEqual(err.constructor.name, 'MagentoEndpointError')
      assert.strictEqual(err.code, 'EINTERNAL')
      done()
    })
  })

  it('should return an error because cart id is missing', (done) => {
    input.cartId = null

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.strictEqual(err.constructor.name, 'InvalidCallError')
      assert.strictEqual(err.code, 'EINVALIDCALL')
      done()
    })
  })
})
