const assert = require('assert')
const moment = require('moment')
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
    cartId: null
  }

  beforeEach(() => {
    input.cartId = 'c1'
    request.post = () => {}
  })

  it('should return the checkout url', (done) => {
    const responseBody = {'expires_in': 3600, url: 'http://some.url/2/'}

    request.post = (options, cb) => {
      cb(null, {statusCode: 200}, responseBody)
    }

    step(context, input, (err, result) => {
      const calculatedDate = moment(result.expires, moment.ISO_8601, true);
      assert.ifError(err)
      assert.equal(calculatedDate.isValid(), true)
      assert.equal(result.url, responseBody.url + 'sgcloud_inapp/1/utm_source/shopgate/utm_medium/app/utm_campaign/web-checkout/')
      done()
    })
  })

  it('should return an error because the request failed (client)', (done) => {
    request.post = (options, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('should return an error because the request failed (server)', (done) => {
    request.post = (options, cb) => {
      cb(null, {statusCode: 456}, {foo: 'bar'})
    }

    step(context, input, (err, result) => {
      assert.equal(err.message, 'Got 456 from magento: {"foo":"bar"}')
      done()
    })
  })

  it('should return an error because cart id is missing', (done) => {
    input.cartId = null

    step(context, input, (err, result) => {
      assert.equal(err.message, 'cart id missing')
      done()
    })
  })
})
