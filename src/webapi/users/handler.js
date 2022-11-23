class UsersHandler {
  constructor (service, validator) {
    this._usersService = service
    this._validator = validator

    this.postUser = this.postUser.bind(this)
  }

  async postUser (request, h) {
    this._validator.validatePayload(request.payload)
    const { username, password, fullname } = request.payload

    const userId = await this._usersService.add({ username, password, fullname })

    const response = h.response({
      status: 'success',
      message: 'Successfully added new user',
      data: {
        userId
      }
    })

    response.code(201)
    return response
  }
}

module.exports = UsersHandler
