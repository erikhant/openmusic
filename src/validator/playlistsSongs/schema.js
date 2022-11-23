const Joi = require('joi')

const playlistsSongsPayloadSchema = Joi.object({
  songId: Joi.string().required()
})

module.exports = playlistsSongsPayloadSchema
