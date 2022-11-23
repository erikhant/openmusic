const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const { ClientError } = require('./common/exceptions')

const songs = require('./webapi/songs')
const albums = require('./webapi/albums')
const users = require('./webapi/users')
const authentications = require('./webapi/authentications')
const playlists = require('./webapi/playlists')
const playlistsSongs = require('./webapi/playlistsSongs')
const playlistsActivities = require('./webapi/playlistsActivities')
const collaborations = require('./webapi/collaborations')
const PostgresServices = require('./services/persistence')
const { jwtTokenManager } = require('./services/tokenize')

const {
  albumsValidator,
  songsValidator,
  usersValidator,
  authenticationsValidator,
  playlistsValidator,
  playlistsSongsValidator,
  collaborationsValidator
} = require('./validator')

require('dotenv').config()

const services = new PostgresServices()

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
      plugin: Jwt
    }
  ])

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: songs,
      options: {
        ...services,
        validator: songsValidator
      }
    },
    {
      plugin: albums,
      options: {
        ...services,
        validator: albumsValidator
      }
    },
    {
      plugin: users,
      options: {
        ...services,
        validator: usersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        ...services,
        tokenManager: jwtTokenManager,
        validator: authenticationsValidator
      }
    },
    {
      plugin: playlists,
      options: {
        ...services,
        validator: playlistsValidator
      }
    },
    {
      plugin: playlistsSongs,
      options: {
        ...services,
        validator: playlistsSongsValidator
      }
    },
    {
      plugin: playlistsActivities,
      options: {
        ...services
      }
    },
    {
      plugin: collaborations,
      options: {
        ...services,
        validator: collaborationsValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

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
