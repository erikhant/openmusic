const PlaylistsActivitiesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlistsActivities',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistsActivitiesService }) => {
    const handler = new PlaylistsActivitiesHandler(playlistsService, playlistsActivitiesService)
    server.route(routes(handler))
  }
}
