const SongHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { persistence, validator }) => {
    const handler = new SongHandler(persistence, validator)
    server.route(routes(handler))
  }
}
