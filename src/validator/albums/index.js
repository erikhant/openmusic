const { ValidationError } = require('../../common/exceptions')
const albumsPayloadSchema = require('./schema')

const albumsValidator = {
  validatePayload: (payload) => {
    const validationResult = albumsPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = albumsValidator
