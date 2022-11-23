class PlaylistsSongsHandler {
  constructor (
    songsService,
    playlistsService,
    playlistsSongsService,
    playlistsActivitiesService,
    validator
  ) {
    this._songsService = songsService
    this._playlistsService = playlistsService
    this._playlistsSongsService = playlistsSongsService
    this._playlistsActivitiesService = playlistsActivitiesService
    this._validator = validator

    this.postPlaylistsSongs = this.postPlaylistsSongs.bind(this)
    this.getPlaylistsSongsById = this.getPlaylistsSongsById.bind(this)
    this.deletePlaylistsSongsById = this.deletePlaylistsSongsById.bind(this)
  }

  async postPlaylistsSongs ({ payload, params, auth }, h) {
    this._validator.validatePayload(payload)
    const { id: userId } = auth.credentials
    const { id: playlistId } = params
    const { songId } = payload

    await this._songsService.any(songId)

    await this._playlistsService.verifyAccess(playlistId, userId)

    await this._playlistsSongsService.add(playlistId, songId)

    await this._playlistsActivitiesService.add(playlistId, songId, userId, 'add')

    const response = h.response({
      status: 'success',
      message: 'Successfully added song to playlist'
    })

    response.code(201)
    return response
  }

  async getPlaylistsSongsById ({ params, auth }) {
    const { id: userId } = auth.credentials
    const { id: playlistId } = params

    await this._playlistsService.verifyAccess(playlistId, userId)

    const playlist = await this._playlistsSongsService.getById(playlistId)

    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  async deletePlaylistsSongsById ({ payload, params, auth }) {
    const { id: userId } = auth.credentials
    const { id: playlistId } = params
    const { songId } = payload

    this._validator.validatePayload(payload)

    await this._playlistsService.verifyAccess(playlistId, userId)

    await this._playlistsSongsService.delete(songId)

    await this._playlistsActivitiesService.add(playlistId, songId, userId, 'delete')

    return {
      status: 'success',
      message: 'Successfully deleted song from playlist'
    }
  }
}

module.exports = PlaylistsSongsHandler
