const assert = require('assert')
const Price = require('../../../../../models/shopgate/cart/price')
const Product = require('../../../../../models/shopgate/cart/product')
const CartItem = require('../../../../../models/shopgate/cart/cartItem')
const Message = require('../../../../../models/shopgate/cart/message')

describe('CartItem', () => {
  it('should create a cart item', (done) => {
    const price = new Price('USD', 1, 1)
    const product = new Product('id', 'name', 'http://image.de', price)
    const cartItem = new CartItem('id', 1, 'product', product)
    cartItem.addMessage(new Message('info', 'message'))

    assert.strictEqual(cartItem.id, 'id')
    assert.strictEqual(cartItem.quantity, 1)
    assert.strictEqual(cartItem.type, 'product')
    assert.deepStrictEqual(cartItem.product, product)
    assert.strictEqual(cartItem.messages[0].type, 'info')
    assert.strictEqual(cartItem.messages[0].message, 'message')
    done()
  })
})
