const { ValidationError } = require('../../common/exceptions')
const usersPayloadSchema = require('./schema')

const usersValidator = {
  validatePayload: (payload) => {
    const validationResult = usersPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message)
    }
  }
}

module.exports = usersValidator
