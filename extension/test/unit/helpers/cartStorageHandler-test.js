const assert = require('assert')
const CartStorageHandler = require('../../../helpers/cartStorageHandler')

describe('CartStorageHandler', () => {
  const storages = {
    user: {
      set: null,
      get: null
    },
    device: {
      set: null,
      get: null
    }
  }

  beforeEach(() => {
    storages.device.get = () => {}
    storages.device.set = () => {}
    storages.user.get = () => {}
    storages.user.set = () => {}
  })

  describe('set', () => {
    it('should set the cart in storage', (done) => {
      storages.user.set = (key, value, cb) => {
        cb()
      }
      const csh = new CartStorageHandler(storages)
      csh.set({}, true, (err) => {
        assert.ifError(err)
        done()
      })
    })

    it('should return an error because the storage failed', (done) => {
      storages.user.set = (key, value, cb) => { cb(new Error('error')) }
      const csh = new CartStorageHandler(storages)
      csh.set({}, true, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })
  })
  describe('get', () => {
    it('should get the cart from storage', (done) => {
      storages.device.get = (key, cb) => {
        cb()
      }
      const csh = new CartStorageHandler(storages)
      csh.get(false, (err) => {
        assert.ifError(err)
        done()
      })
    })

    it('should return an error because the storage failed', (done) => {
      storages.device.get = (key, cb) => { cb(new Error('error')) }
      const csh = new CartStorageHandler(storages)
      csh.get(false, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })
  })
})
