const Hapi = require('@hapi/hapi')
const songs = require('./webapi/songs')
const albums = require('./webapi/albums')
const PostgresDbPersistence = require('./services/persistence')
const ClientError = require('./common/exceptions/ClientError')
const { albumValidator, songValidator } = require('./validator')

require('dotenv').config()

const init = async () => {
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
        persistence: new PostgresDbPersistence(),
        validator: songValidator
      }
    },
    {
      plugin: albums,
      options: {
        persistence: new PostgresDbPersistence(),
        validator: albumValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request
    // console.log(response)
    if (response instanceof Error) {
      if (response instanceof ClientError) {
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
