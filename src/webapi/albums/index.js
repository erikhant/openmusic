const AlbumHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { persistence, validator }) => {
    const handler = new AlbumHandler(persistence, validator)
    server.route(routes(handler))
  }
}
