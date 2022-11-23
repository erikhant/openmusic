class AuthenticationsHandler {
  constructor (authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService
    this._usersService = usersService
    this._tokenManager = tokenManager
    this._validator = validator

    this.postAuthentication = this.postAuthentication.bind(this)
    this.putAuthentication = this.putAuthentication.bind(this)
    this.deleteAuthentication = this.deleteAuthentication.bind(this)
  }

  async postAuthentication (request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload)

    const { username, password } = request.payload
    const id = await this._usersService.verifyCredential(username, password)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    const refreshToken = this._tokenManager.generateRefreshToken({ id })

    await this._authenticationsService.addRefreshToken(refreshToken)

    const response = h.response({
      status: 'success',
      message: 'authentication has been added',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthentication (request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload)

    const { refreshToken } = request.payload
    await this._authenticationsService.verifyRefreshToken(refreshToken)

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    return {
      status: 'success',
      message: 'Access Token has been updated',
      data: { accessToken }
    }
  }

  async deleteAuthentication (request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload)

    const { refreshToken } = request.payload
    await this._authenticationsService.verifyRefreshToken(refreshToken)
    await this._authenticationsService.deleteRefreshToken(refreshToken)

    return {
      status: 'success',
      message: 'Refresh Token has been deleted'
    }
  }
}

module.exports = AuthenticationsHandler
