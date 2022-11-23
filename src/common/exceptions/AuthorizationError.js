const ClientError = require('./ClientError')

class AuthorizationError extends ClientError {
  constructor (message = 'You do not have access to this resource') {
    super(message, 403)
    this.name = 'AuthorizationError'
  }
}

module.exports = AuthorizationError
