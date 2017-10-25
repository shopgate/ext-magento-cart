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
    }
  }

  const input = {
    token: 'a1',
    cartId: 'c1'
  }

  beforeEach(() => {
    request.get = () => {}
  })

  it('should return the checkout url', (done) => {
    const responseBody = {'expires_in': 3600, url: 'http://some.url/2'}

    request.get = (options, cb) => {
      cb(null, {statusCode: 200}, responseBody)
    }

    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.equal(result.expires, responseBody['expires_in'])
      assert.equal(result.url, responseBody.url)
      done()
    })
  })

  it('should return an error because the request failed (client)', (done) => {
    request.get = (options, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because the request failed (server)', (done) => {
    request.get = (options, cb) => {
      cb(null, {statusCode: 456}, {foo: 'bar'})
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'Got 456 from magento: {"foo":"bar"}')
      done()
    })
  })
})
