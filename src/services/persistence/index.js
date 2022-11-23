const UsersService = require('./postgres/Users')
const AuthenticationsService = require('./postgres/Authentications')
const SongsService = require('./postgres/Songs')
const AlbumsService = require('./postgres/Albums')
const PlaylistsService = require('./postgres/Playlists')
const PlaylistsSongsService = require('./postgres/PlaylistsSongs')
const PlaylistsActivitiesService = require('./postgres/PlaylistsActivities')
const CollaborationsService = require('./postgres/Collaborations')

class DbPersistence {
  constructor () {
    this.songsService = new SongsService()
    this.albumsService = new AlbumsService()
    this.usersService = new UsersService()
    this.authenticationsService = new AuthenticationsService()
    this.collaborationsService = new CollaborationsService()
    this.playlistsService = new PlaylistsService(new CollaborationsService())
    this.playlistsSongsService = new PlaylistsSongsService()
    this.playlistsActivitiesService = new PlaylistsActivitiesService()
  }
}

module.exports = DbPersistence
