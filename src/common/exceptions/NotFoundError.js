const ClientError = require('./ClientError')

class NotFoundError extends ClientError {
  constructor ({ entityName, fieldName, request }) {
    super(`${entityName} with ${fieldName} [${request}] is not found.`, 404)
    this.name = 'NotFoundError'
  }
}

module.exports = NotFoundError
