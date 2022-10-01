const Hapi = require('@hapi/hapi')
const songs = require('./webapi/songs')
const PostgresDbContext = require('./services/persistence')
const { ClientError, AlreadyExistsError } = require('./common/exceptions')
const songValidator = require('./validator/song')
const albumValidator = require('./validator/album')

require('dotenv').config()

const init = async () => {
//   const notesService = new NotesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: songs,
      options: {
        persistence: new PostgresDbContext(),
        validator: songValidator
      }
    },
    {
      plugin: albums,
      options: {
        persistence: new PostgresDbContext(),
        validator: albumValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request
    if (response instanceof Error) {
      if (response instanceof ClientError || response instanceof AlreadyExistsError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'We are sorry, there was a failure on our server'
      })

      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  await server.start()

  console.log(`Server is running on ${server.info.uri}`)
}

init()
