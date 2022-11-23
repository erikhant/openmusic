class CollaborationsHandler {
  constructor (
    collaborationsService,
    playlistsService,
    usersService,
    validator
  ) {
    this._collaborationsService = collaborationsService
    this._playlistsService = playlistsService
    this._usersService = usersService
    this._validator = validator

    this.postCollaborations = this.postCollaborations.bind(this)
    this.deleteCollaborations = this.deleteCollaborations.bind(this)
  }

  async postCollaborations ({ payload, auth }, h) {
    this._validator.validatePayload(payload)

    const { playlistId, userId } = payload
    const { id: credentialId } = auth.credentials

    await this._playlistsService.verifyOwner(playlistId, credentialId)

    await this._usersService.any(userId)

    const id = await this._collaborationsService.add(playlistId, userId)

    const response = h.response({
      status: 'success',
      data: {
        collaborationId: id
      }
    })

    response.code(201)
    return response
  }

  async deleteCollaborations ({ payload, auth }) {
    this._validator.validatePayload(payload)
    const { playlistId, userId: collaboratorId } = payload
    const { id: credentialId } = auth.credentials

    await this._playlistsService.verifyOwner(playlistId, credentialId)

    await this._collaborationsService.delete(playlistId, collaboratorId)

    return {
      status: 'success',
      message: 'Successfully deleted collaboration'
    }
  }
}

module.exports = CollaborationsHandler
