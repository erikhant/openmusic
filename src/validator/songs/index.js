const { ValidationError } = require('../../common/exceptions')
const songsPayloadSchema = require('./schema')

const songsValidator = {
  validatePayload: (payload) => {
    const validationResult = songsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = songsValidator
