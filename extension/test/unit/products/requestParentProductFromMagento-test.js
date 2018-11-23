const step = require('../../../products/requestParentProductFromMagento')
const assert = require('assert')
const request = require('request')
const nock = require('nock')

function copy (stringifyable) {
  return JSON.parse(JSON.stringify(stringifyable))
}

describe('requestParentProductFromMagento', () => {
  const context = {
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://magento.shopgate.com',
      authUrl: 'http://authUrl.com/auth',
      productUrl: 'http://productUrl.com/product',
      credentials: {
        id: 'testId',
        secret: 'testSecret'
      }
    },
    storage: {
      extension: {
        get: () => {
        },
        set: () => {
        }
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
    productId: 'testProduct',
    token: 'at'
  }

  describe('testing the whole step', () => {
    it('should get a parent product from magento', (done) => {
      const magentoProduct = copy(require('../data/magento-configurable-product.json'))

      nock(context.config.magentoUrl).get('/products/testProduct').reply(200, magentoProduct)

      step(context, input, (err, result) => {
        assert.ifError(err)
        assert.deepEqual(result.product, magentoProduct)
        done()
      })
    })

    it('should return an error because requestParentProductFromMagento fails', (done) => {
      nock(context.config.magentoUrl).get('/products/testProduct').reply(201, { messages: { error: [{ message: 'error' }] } })

      step(context, input, (err) => {
        assert.equal(err.message, 'An internal error occurred.')
        done()
      })
    })
  })

  describe('directly testing the function', () => {
    it('should return an error because the magento response status code is >= 400', (done) => {
      nock(context.config.magentoUrl).get('/products/testProduct').reply(401, { messages: { error: [{ message: 'An internal error occurred.' }] } })

      step(context, input, (err) => {
        assert.equal(err.message, 'An internal error occurred.')
        assert.equal(err.constructor.name, 'MagentoEndpointError')
        assert.equal(err.code, 'EINTERNAL')
        done()
      })
    })
  })
})
