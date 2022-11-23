const { ValidationError } = require('../../common/exceptions')
const collaborationsPayloadSchema = require('./schema')

const collaborationsValidator = {
  validatePayload: (payload) => {
    const validationResult = collaborationsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = collaborationsValidator
