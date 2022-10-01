const { ValidationError } = require('../../common/exceptions')
const { albumPayloadSchema } = require('./schema')

const albumValidator = {
  validate: (payload) => {
    const validationResult = albumPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = albumValidator
