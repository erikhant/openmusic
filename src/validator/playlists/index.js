const { ValidationError } = require('../../common/exceptions')
const playlistsPayloadSchema = require('./schema')

const playlistsValidator = {
  validatePayload: (payload) => {
    const validationResult = playlistsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = playlistsValidator
