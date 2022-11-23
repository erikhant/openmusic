const PlaylistsSongsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlistsSongs',
  version: '1.0.0',
  register: async (
    server, {
      songsService,
      playlistsService,
      playlistsSongsService,
      playlistsActivitiesService,
      validator
    }
  ) => {
    const handler = new PlaylistsSongsHandler(
      songsService,
      playlistsService,
      playlistsSongsService,
      playlistsActivitiesService,
      validator
    )
    server.route(routes(handler))
  }
}
