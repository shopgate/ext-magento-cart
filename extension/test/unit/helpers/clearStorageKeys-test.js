const assert = require('assert')
const step = require('../../../helpers/clearStorageKeys')

describe('clearStorageKeys', () => {
  const deletions = [{ storage: 'device', key: 'token' }]
  const input = { deletions }
  const context = {
    storage: {
      device: {
        del: null
      }
    }
  }

  beforeEach(() => {
    context.storage.device.del = (key, cb) => {
      cb()
    }
  })

  it('should clear the storage keys', (done) => {
    step(context, input, (err) => {
      assert.ifError(err)
      done()
    })
  })

  it('should get an error because del fails', (done) => {
    context.storage.device.del = (key, cb) => { cb(new Error('error')) }

    step(context, input, (err) => {
      assert.strictEqual(err.message, 'error')
      done()
    })
  })
})
