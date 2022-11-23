class AlbumsHandler {
  constructor (service, validator) {
    this._albumsService = service
    this._validator = validator

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
  }

  async postAlbum (request, h) {
    this._validator.validatePayload(request.payload)
    const albumId = await this._albumsService.add(request.payload)

    const response = h.response({
      status: 'success',
      data: { albumId }
    })

    response.code(201)
    return response
  }

  async getAlbumById (request, h) {
    const { id } = request.params
    const album = await this._albumsService.getById(id)

    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  async putAlbumById (request, h) {
    this._validator.validatePayload(request.payload)

    const { id } = request.params
    await this._albumsService.update(id, request.payload)

    return {
      status: 'success',
      message: `Successfully updated album [${id}]`
    }
  }

  async deleteAlbumById (request, h) {
    const { id } = request.params
    await this._albumsService.delete(id)

    return {
      status: 'success',
      message: `Successfully deleted album [${id}]`
    }
  }
}

module.exports = AlbumsHandler
