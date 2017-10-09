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

    assert.equal(cartItem.id, 'id')
    assert.equal(cartItem.quantity, 1)
    assert.equal(cartItem.type, 'product')
    assert.deepEqual(cartItem.product, product)
    assert.equal(cartItem.messages[0].type, 'info')
    assert.equal(cartItem.messages[0].message, 'message')
    done()
  })
})
