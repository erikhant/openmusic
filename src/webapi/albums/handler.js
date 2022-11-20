class AlbumHandler {
  constructor (service, validator) {
    this._context = service
    this._validator = validator

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
  }

  async postAlbum (request, h) {
    this._validator.validate(request.payload)

    const albumId = await this._context.add(request.payload)

    const response = h.response({
      status: 'success',
      data: { albumId }
    })

    response.code(201)
    return response
  }

  async getAlbumById (request, h) {
    const { id } = request.params
    const album = await this._context.getById(id)

    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  async putAlbumById (request, h) {
    this._validator.validate(request.payload)

    const { id } = request.params
    await this._context.update(id, request.payload)

    return {
      status: 'success',
      message: `album with id [${id}] has been updated successfully`
    }
  }

  async deleteAlbumById (request, h) {
    const { id } = request.params
    await this._context.delete(id)

    return {
      status: 'success',
      message: `album with id [${id}] has been deleted`
    }
  }
}

module.exports = AlbumHandler
