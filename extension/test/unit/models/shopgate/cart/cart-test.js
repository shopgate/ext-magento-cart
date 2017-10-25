const assert = require('assert')
const Price = require('../../../../../models/shopgate/cart/price')
const Product = require('../../../../../models/shopgate/cart/product')
const CartItem = require('../../../../../models/shopgate/cart/cartItem')
const Total = require('../../../../../models/shopgate/cart/total')
const Message = require('../../../../../models/shopgate/cart/message')
const Text = require('../../../../../models/shopgate/cart/text')
const Cart = require('../../../../../models/shopgate/cart/cart')

describe('Cart', () => {
  it('should create a cart object', (done) => {
    const price = new Price('USD', 1, 1)
    const product = new Product('id', 'name', 'http://image.de', price)
    const cartItem = new CartItem('id', 1, 'product', product)
    const total = new Total('grandTotal', 'Total', 1)
    const message = new Message('info', 'message')
    const text = new Text('legal')
    const cart = new Cart([cartItem], 'USD', [total], true)
    cart.addMessage(message)
    cart.setText(text)
    cart.setIsTaxIncluded(true)
    cart.setIsOrderable(true)

    assert.deepEqual(cart.cartItems, [cartItem])
    assert.equal(cart.currency, 'USD')
    assert.deepEqual(cart.totals, [total])
    assert.equal(cart.enableCoupons, true) // Backwards compatibility
    assert.equal(cart.flags.coupons, true)
    assert.deepEqual(cart.messages, [message])
    assert.deepEqual(cart.text, text)
    assert.equal(cart.isTaxIncluded, true) // Backwards compatibility
    assert.equal(cart.flags.taxIncluded, true)
    assert.equal(cart.isOrderable, true) // Backwards compatibility
    assert.equal(cart.flags.orderable, true)
    done()
  })
})
