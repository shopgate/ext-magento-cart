const assert = require('assert')
const step = require('../../../../products/helpers/exportAsObject')

describe('exportAsObject', () => {
  it('should export an element in an complete object', (done) => {
    const input = {element: {foo: 'bar'}}
    step(null, input, (err, result) => {
      assert.ifError(err)
      assert.deepEqual(result, input.element)
      done()
    })
  })
})
