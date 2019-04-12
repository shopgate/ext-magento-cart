const handleCartErrors = require('../../../cart/handleCartErrors')
const EntityNotFoundError = require('../../../models/Errors/EntityNotFoundError')
const EntityForbiddenError = require('../../../models/Errors/EntityForbiddenError')
const MagentoError = require('../../../models/Errors/MagentoEndpointError')
const assert = require('assert')

describe('handleCartErrors', () => {
  const emptyCart = {
    isOrderable: false,
    isTaxIncluded: false,
    currency: 'unkown',
    messages: [],
    text: null,
    cartItems: [],
    totals: [],
    enableCoupons: false,
    flags: {
      orderable: false,
      taxIncluded: false,
      coupons: false
    }
  }

  const validCart = {
    isOrderable: true,
    isTaxIncluded: false,
    currency: 'EUR',
    messages: [],
    text: null,
    cartItems: [],
    totals: [],
    enableCoupons: true,
    flags: {
      orderable: false,
      taxIncluded: false,
      coupons: false
    }
  }

  const context = {
    meta: {
        userId: null
    },
    storage: {
      device: {
        del: () => {}
      },
      user: {
        del: () => {}
      }
    },
    log: {
      debug: () => {},
      error: () => {},
      warn: () => {}
    }
  }

  describe('customer', () => {
    beforeEach(() => {
      context.meta.userId = 1
    })

    it('should return empty cart for ENOTFOUND error', async () => {
      const response = await handleCartErrors(new EntityNotFoundError(), context, {})
      assert.deepEqual(response, emptyCart)
    })

    it('should return empty cart for EFORBIDDEN error', async () => {
      const response = await handleCartErrors(new EntityForbiddenError(), context, {})
      assert.deepEqual(response, emptyCart)
    })

    it('should return the cart if no error was thrown', async () => {
      const response = await handleCartErrors(null, context, validCart)
      assert.deepEqual(response, validCart)
    })

    it('should throw the error, if it is not 403 or 404', async () => {
      try {
        await handleCartErrors(new MagentoError(), context, {})
        assert.fail('no exception was thrown')
      } catch (err) {
        assert.strictEqual(err.code, 'EINTERNAL')
      }
    })
  })

  describe('guest', () => {
    beforeEach(() => {
      context.meta.userId = null
    })

    it('should return empty cart for ENOTFOUND error', async () => {
      const response = await handleCartErrors(new EntityNotFoundError(), context, {})
      assert.deepEqual(response, emptyCart)
    })

    it('should return empty cart for EFORBIDDEN error', async () => {
      const response = await handleCartErrors(new EntityForbiddenError(), context, {})
      assert.deepEqual(response, emptyCart)
    })

    it('should return the cart if no error was thrown', async () => {
      const response = await handleCartErrors(null, context, validCart)
      assert.deepEqual(response, validCart)
    })

    it('should throw the error, if it is not 403 or 404', async () => {
      try {
        await handleCartErrors(new MagentoError(), context, {})
        assert.fail('no exception was thrown')
      } catch (err) {
        assert.strictEqual(err.code, 'EINTERNAL')
      }
    })
  })
})
