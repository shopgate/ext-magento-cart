class Message {
  constructor (type, message) {
    this.type = type
    this.message = message
    this.code = null
  }

  setCode (code) {
    this.code = code
  }
}

module.exports = Message
