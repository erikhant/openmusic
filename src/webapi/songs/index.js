const SongHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { DbContext, validator }) => {
    const handler = new SongHandler(DbContext, validator)
    server.route(routes(handler))
  }
}
