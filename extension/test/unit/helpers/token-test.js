const assert = require('assert')
const TokenHandler = require('../../../helpers/token')

describe('token', () => {
  const credentials = {
    id: 'testId',
    secret: 'testSecret'
  }
  const authUrl = 'http://authUrl.xyz/auth/token'
  const storages = {
    extension: {
      get: () => {},
      set: () => {}
    }
  }
  const log = {
    debug: () => {}
  }
  let request = () => {
    return {
      post: () => {}
    }
  }

  beforeEach(() => {
    storages.extension.get = () => {}
    storages.extension.set = () => {}
    request.post = () => {
      return {
        post: () => {}
      }
    }
  })

  describe('getTokens', () => {
    it('should get tokens from store', (done) => {
      const resultingTokens = {accessToken: 'lol', refreshToken: 'rofl'}
      const tokenData = {
        tokens: resultingTokens,
        expires: (new Date()).getTime() + 240 * 1000
      }

      storages.extension.get = (key, cb) => {
        cb(null, tokenData)
      }

      const th = new TokenHandler(credentials, authUrl, storages, log, request)
      th.getTokens((err, tokens) => {
        assert.ifError(err)
        assert.deepEqual(resultingTokens, tokens)
        done()
      })
    })

    it('should return an error from the storage func', (done) => {
      storages.extension.get = (key, cb) => {
        cb(new Error('error'))
      }

      const th = new TokenHandler(credentials, authUrl, storages, log, request)
      th.getTokens((err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should get tokens from magento', (done) => {
      const resultingTokens = {accessToken: 'lol'}
      const weirdMagentoResponse = {
        success: [
          {
            access_token: 'lol',
            expires: 3600
          }
        ]
      }

      storages.extension.get = (key, cb) => cb(null, null)

      request = () => {
        return {
          post: (options, cb) => {
            cb(null, {statusCode: 200}, weirdMagentoResponse)
          }
        }
      }

      storages.extension.set = (key, tokens, cb) => {
        cb(null)
      }

      const th = new TokenHandler(credentials, authUrl, storages, log, request)
      th.getTokens((err, tokens) => {
        assert.ifError(err)
        assert.deepEqual(resultingTokens, tokens)
        done()
      })
    })

    it('should return an error because of magento fails', (done) => {
      storages.extension.get = (key, cb) => cb(null, null)

      request = () => {
        return {
          post: (options, cb) => {
            cb(new Error('error'))
          }
        }
      }

      const th = new TokenHandler(credentials, authUrl, storages, log, request)
      th.getTokens((err, tokens) => {
        assert.equal(err.message, 'error')
        done()
      })
    })
  })

  it('should return an error because storage fails', (done) => {
    const weirdMagentoResponse = {
      success: [
        {
          access_token: 'lol',
          expires: 3600
        }
      ]
    }

    storages.extension.get = (key, cb) => cb(null, null)

    request = () => {
      return {
        post: (options, cb) => {
          cb(null, {statusCode: 200}, weirdMagentoResponse)
        }
      }
    }

    storages.extension.set = (key, tokens, cb) => {
      cb(new Error('error'))
    }

    const th = new TokenHandler(credentials, authUrl, storages, log, request)
    th.getTokens((err, tokens) => {
      assert.equal(err.message, 'error')
      done()
    })
  })

  describe('getTokensFromMagento', () => {
    it('should return an error because the status code is >= 400', (done) => {
      storages.extension.get = (key, cb) => cb(null, null)

      request = () => {
        return {
          post: (options, cb) => {
            cb(null, {statusCode: 400}, {foo: 'err'})
          }
        }
      }

      const th = new TokenHandler(credentials, authUrl, storages, log, request)
      th.getTokens((err, tokens) => {
        assert.equal(err.message, 'got error (400) from magento: {"foo":"err"}')
        done()
      })
    })

    it('should return an error because the magento response is invalid', (done) => {
      storages.extension.get = (key, cb) => cb(null, null)

      request = () => {
        return {
          post: (options, cb) => {
            cb(null, {statusCode: 200}, {foo: 'err'})
          }
        }
      }

      const th = new TokenHandler(credentials, authUrl, storages, log, request)
      th.getTokens((err, tokens) => {
        assert.equal(err.message, 'received invalid response from magento: {"foo":"err"}')
        done()
      })
    })
  })
})
