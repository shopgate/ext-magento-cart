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

    assert.deepStrictEqual(cart.cartItems, [cartItem])
    assert.strictEqual(cart.currency, 'USD')
    assert.deepStrictEqual(cart.totals, [total])
    assert.strictEqual(cart.enableCoupons, true) // Backwards compatibility
    assert.strictEqual(cart.flags.coupons, true)
    assert.deepStrictEqual(cart.messages, [message])
    assert.deepStrictEqual(cart.text, text)
    assert.strictEqual(cart.isTaxIncluded, true) // Backwards compatibility
    assert.strictEqual(cart.flags.taxIncluded, true)
    assert.strictEqual(cart.isOrderable, true) // Backwards compatibility
    assert.strictEqual(cart.flags.orderable, true)
    done()
  })
})
