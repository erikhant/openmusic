const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const { InvariantError, AuthorizationError } = require('../../../common/exceptions')

class Collaborations {
  #name = 'collaborations'
  constructor () {
    this._pool = new Pool()
  }

  async add (playlistId, userId) {
    const id = `collabs-${nanoid(16)}`

    const query = {
      text: `INSERT INTO ${this.#name} VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('An error occurred while saving data')
    }

    return result.rows[0].id
  }

  async delete (playlistId, userId) {
    const query = {
      text: `DELETE FROM ${this.#name} WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('An error occurred while deleting data')
    }
  }

  async verifyCollaborator (playlistId, userId) {
    const query = {
      text: `SELECT * FROM ${this.#name} WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthorizationError()
    }
  }
}

module.exports = Collaborations
