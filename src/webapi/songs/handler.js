class SongHandler {
  constructor (DbContext, validator) {
    this._context = DbContext
    this._validator = validator

    this.postSong = this.postSong.bind(this)
    this.getSongs = this.getSongs.bind(this)
    this.getSongById = this.getSongById.bind(this)
    this.putSongById = this.putSongById.bind(this)
    this.deleteSongById = this.deleteSongById.bind(this)
  }

  async postSong (request, h) {
    this._validator.validate(request.payload)

    const songId = await this._context.songs.add(request.payload)

    const response = h.response({
      status: 'success',
      data: { songId }
    })

    response.code(201)
    return response
  }

  async getSongs (request) {
    const songs = await this._context.songs.getAll(request.query)

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongById (request, h) {
    const { id } = request.params
    const song = await this._context.songs.getById(id)

    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async putSongById (request, h) {
    this._validator.validate(request.payload)

    const { id } = request.params
    await this._context.songs.update(id, request.payload)

    return {
      status: 'success',
      message: `song with id [${id}] has been updated successfully`
    }
  }

  async deleteSongById (request, h) {
    const { id } = request.params
    await this._context.songs.delete(id)

    return {
      status: 'success',
      message: `song with id [${id}] has been deleted`
    }
  }
}

module.exports = SongHandler
