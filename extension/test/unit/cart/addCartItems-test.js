const assert = require('assert')
const step = require('../../../cart/addCartItems')
const request = require('request')
const nock = require('nock')

describe('addCartItems', () => {
  let errorMessage = 'Some error message'

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
    meta: {}
  }

  const input = {
    token: 'at',
    transformedItems: [
      {
        'product_id': '1',
        'qty': 1
      }
    ],
    cartId: 1234
  }

  it('should add products to cart', (done) => {
    nock(context.config.magentoUrl).post('/carts/1234/items').reply(200, {});
    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.ifError(err)
      done()
    })
  })

  it('should return an error because of the request', (done) => {
    nock(context.config.magentoUrl).post('/carts/1234/items').reply(450, {messages: {error: [{message: 'error'}]}});
    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  it('unknown error structure returned by Magento should produce an empty result', (done) => {
    nock(context.config.magentoUrl).post('/carts/1234/items').reply(404, {message: {unknown: [{error: 'structure'}]}});
    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, '')
      done()
    })
  })

  it('should return an InvalidItemError because the statusCode of the response is >= 400 && < 500', (done) => {
    let errorMessage = 'Some error message'

    nock(context.config.magentoUrl).post('/carts/1234/items').reply(450, {messages: {error: [{message: errorMessage}]}});

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.message, errorMessage)
      assert.equal(err.constructor.name, 'InvalidItemError')
      done()
    })
  })

  it('should return an MagentoEndpointError because the statusCode of the response is != 200 && >= 500', (done) => {
    nock(context.config.magentoUrl).post('/carts/1234/items').reply(501, {messages: {error: [{message: errorMessage}]}});

    // noinspection JSCheckFunctionSignatures
    step(context, input, (err) => {
      assert.equal(err.constructor.name, 'MagentoEndpointError')
      assert.equal(err.code, 'EINTERNAL')
      done()
    })
  })
})
