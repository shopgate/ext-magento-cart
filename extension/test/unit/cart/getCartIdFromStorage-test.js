const assert = require('assert')
const step = require('../../../cart/getCartIdFromStorage')

describe('getCartIdFromStorage', () => {
  const context = {
    storage: {
      device: {
        get: null
      }
    },
    log: {
      debug: () => {}
    }
  }

  it('should return the cart id from storage', (done) => {
    context.storage.device.get = (key, cb) => cb(null, '12345678')

    step(context, null, (err, result) => {
      assert.ifError(err)
      assert.equal(result.cartId, '12345678')
      done()
    })
  })

  it('should return null from storage', (done) => {
    context.storage.device.get = (key, cb) => cb(null, null)

    step(context, null, (err, result) => {
      assert.ifError(err)
      assert.equal(result.cartId, null)
      done()
    })
  })

  it('should return null from storage', (done) => {
    context.storage.device.get = (key, cb) => cb(new Error('error', null))

    step(context, null, (err, result) => {
      assert.equal(err.message, 'error')
      done()
    })
  })
})
