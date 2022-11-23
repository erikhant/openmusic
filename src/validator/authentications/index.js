const {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema
} = require('./schema')

const { ValidationError } = require('../../common/exceptions')

const authenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = postAuthenticationPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const validationResult = putAuthenticationPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = deleteAuthenticationPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = authenticationsValidator
