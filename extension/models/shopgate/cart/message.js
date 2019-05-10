
class Message {
  constructor (type, message) {
    this.type = type // Swagger (2017-11-02): enum: ['error', 'warning', 'info']
    this.message = message
    this.code = null // Swagger (2017-11-02): sth. like 'EUNKNOWN'
    this.translated = false
  }

  setCode (code) {
    this.code = code
  }
}

module.exports = Message
