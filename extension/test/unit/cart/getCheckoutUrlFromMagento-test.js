const assert = require('assert')
const step = require('../../../cart/getCheckoutUrlFromMagento')

describe('getCheckoutUrlFromMagento', () => {
  const request = {
    post: null
  }

  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://some.url'
    },
    log: {
      debug: () => {
      },
      error: () => {
      }
    }
  }

  const input = {
    token: 'a1'
  }

  beforeEach(() => {
    input.cartId = 123
    request.post = () => {
    }
  })

  it('should return the checkout url', (done) => {
    const responseBody = {'expires_in': 3600, url: 'http://some.url/2/'}
    const params = 'sgcloud_inapp/1/utm_source/shopgate/utm_medium/app/utm_campaign/web-checkout/'

    request.post = (options, cb) => {
      cb(null, {statusCode: 200}, responseBody)
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.expires, responseBody['expires_in'])
      assert.equal(result.url, responseBody.url + params)
      done()
    })
  })

  it('should throw an error despite code 200 and if url is not returned', (done) => {
    const responseBody = {'expires_in': 3600}

    request.post = (options, cb) => {
      cb(null, {statusCode: 200}, responseBody)
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.message, 'An internal error occurred.')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })

  it('should return an error because the request failed (client)', (done) => {
    request.post = (options, cb) => {
      cb(new Error('error'))
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because the request failed (server)', (done) => {
    request.post = (options, cb) => {
      cb(null, {statusCode: 456}, {foo: 'bar'})
    }

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.message, 'An internal error occurred.')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })

  it('should return an error because cart id is missing', (done) => {
    input.cartId = null

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'Output key "cartId" is missing')
      done()
    })
  })
})
