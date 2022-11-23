const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { InvariantError, NotFoundError, AuthorizationError } = require('../../../common/exceptions')

class Playlists {
  #name = 'playlists'
  constructor (collaborationService) {
    this._collaborationService = collaborationService
    this._pool = new Pool()
  }

  async add (ownerId, name) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: `INSERT INTO ${this.#name} VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, ownerId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('An error occurred while saving data')
    }

    return result.rows[0].id
  }

  async getAll (owner) {
    const query = {
      text: `SELECT ${this.#name}.id, ${this.#name}.name, users.username FROM ${this.#name} LEFT JOIN collaborations ON ${this.#name}.id = collaborations.playlist_id INNER JOIN users ON users.id = ${this.#name}.owner WHERE ${this.#name}.owner = $1 OR collaborations.user_id = $1`,
      values: [owner]
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async delete (id) {
    const query = {
      text: `DELETE FROM ${this.#name} WHERE id = $1 RETURNING owner`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'playlist', fieldName: 'id', request: id })
    }
  }

  async verifyOwner (playlistId, ownerId) {
    const query = {
      text: `SELECT * FROM ${this.#name} WHERE id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'playlist', fieldName: 'id', request: playlistId })
    }

    const playlist = result.rows[0]

    if (playlist.owner !== ownerId) {
      throw new AuthorizationError()
    }
  }

  async verifyAccess (playlistId, userId) {
    try {
      await this.verifyOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError({ entityName: 'playlist', fieldName: 'id', request: playlistId })
      }

      await this._collaborationService.verifyCollaborator(playlistId, userId)
    }
  }
}

module.exports = Playlists
