const SongsService = require('./postgres/Songs')
const AlbumsService = require('./postgres/Albums')

class DbPersistence {
  constructor () {
    this.songs = new SongsService()
    this.albums = new AlbumsService()
  }
}

module.exports = DbPersistence
