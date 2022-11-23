class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylist = this.postPlaylist.bind(this)
    this.getPlaylists = this.getPlaylists.bind(this)
    this.deletePlaylistById = this.deletePlaylistById.bind(this)
  }

  async postPlaylist ({ payload, auth }, h) {
    this._validator.validatePayload(payload)

    const { name } = payload
    const { id: ownerId } = auth.credentials

    const playlistId = await this._service.add(ownerId, name)

    const response = h.response({
      status: 'success',
      data: {
        playlistId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylists ({ auth }) {
    const { id: ownerId } = auth.credentials

    const playlists = await this._service.getAll(ownerId)

    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistById ({ params, auth }) {
    const { id: playlistId } = params
    const { id: ownerId } = auth.credentials

    await this._service.verifyOwner(playlistId, ownerId)
    await this._service.delete(playlistId)

    return {
      status: 'success',
      message: `Successfully deleted playlist [${playlistId}]`
    }
  }
}

module.exports = PlaylistsHandler
