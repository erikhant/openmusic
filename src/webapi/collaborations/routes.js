const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborations,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborations,
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
