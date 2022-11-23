const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { InvariantError } = require('../../../common/exceptions')

class PlaylistsActivities {
  #name = 'playlists_activities'
  constructor () {
    this._pool = new Pool()
  }

  async add (playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: `INSERT INTO ${this.#name} VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [id, playlistId, songId, userId, action, time]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('An error occurred while saving data')
    }
  }

  async getById (playlistId) {
    const query = {
      text: `SELECT u.username, s.title, a.action, a.time FROM ${this.#name} a LEFT JOIN users u ON a.user_id = u.id LEFT JOIN songs s ON a.song_id = s.id WHERE a.playlist_id = $1 ORDER BY a.time ASC`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = PlaylistsActivities
