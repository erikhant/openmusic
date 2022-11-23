const albumsValidator = require('./albums')
const songsValidator = require('./songs')
const usersValidator = require('./users')
const authenticationsValidator = require('./authentications')
const playlistsValidator = require('./playlists')
const playlistsSongsValidator = require('./playlistsSongs')
const collaborationsValidator = require('./collaborations')

module.exports = {
  usersValidator,
  authenticationsValidator,
  songsValidator,
  albumsValidator,
  playlistsValidator,
  playlistsSongsValidator,
  collaborationsValidator
}
