const { ValidationError } = require('../../common/exceptions')
const playlistsSongsPayloadSchema = require('./schema')

const playlistsSongsValidator = {
  validatePayload: (payload) => {
    const validationResult = playlistsSongsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = playlistsSongsValidator
