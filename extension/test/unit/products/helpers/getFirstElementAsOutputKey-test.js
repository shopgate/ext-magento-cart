const assert = require('assert')
const step = require('../../../../products/helpers/setFirstElementAsOutputKey')

describe('setFirstElementAsOutputKey', () => {
  it('should set the first element as output key', (done) => {
    const input = {array: [{foo: 'bar0'}, {foo: 'bar1'}, {foo: 'bar2'}]}
    step(null, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result.element, input.array[0])
      done()
    })
  })

  it('should return an error when input is not correct', (done) => {
    const input = {}
    step(null, input, (err) => {
      assert.equal(err.message, 'first element of array not found')
      done()
    })
  })
})
