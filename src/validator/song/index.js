const { ValidationError } = require('../../common/exceptions')
const { songPayloadSchema } = require('./schema')

const songValidator = {
  validate: (payload) => {
    const validationResult = songPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = songValidator
