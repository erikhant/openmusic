const ClientError = require('./ClientError')

class AuthenticationError extends ClientError {
  constructor (message = 'Your credentials are incorrect') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

module.exports = AuthenticationError
