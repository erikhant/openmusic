class AlreadyExistsError extends Error {
  constructor ({ entityName, fieldName, request }) {
    super(`${entityName} with ${fieldName} [${request}] is already exists.`)
    this.name = 'AlreadyExistsError'
  }
}

module.exports = AlreadyExistsError
