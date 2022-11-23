class SongsHandler {
  constructor (service, validator) {
    this._songsService = service
    this._validator = validator

    this.postSong = this.postSong.bind(this)
    this.getSongs = this.getSongs.bind(this)
    this.getSongById = this.getSongById.bind(this)
    this.putSongById = this.putSongById.bind(this)
    this.deleteSongById = this.deleteSongById.bind(this)
  }

  async postSong (request, h) {
    this._validator.validatePayload(request.payload)

    const songId = await this._songsService.add(request.payload)

    const response = h.response({
      status: 'success',
      data: { songId }
    })

    response.code(201)
    return response
  }

  async getSongs (request) {
    const songs = await this._songsService.getAll(request.query)

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongById (request, h) {
    const { id } = request.params
    const song = await this._songsService.getById(id)

    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async putSongById (request, h) {
    this._validator.validatePayload(request.payload)

    const { id } = request.params
    await this._songsService.update(id, request.payload)

    return {
      status: 'success',
      message: `Successfully updated song [${id}]`
    }
  }

  async deleteSongById (request, h) {
    const { id } = request.params
    await this._songsService.delete(id)

    return {
      status: 'success',
      message: `Successfully deleted song [${id}]`
    }
  }
}

module.exports = SongsHandler
