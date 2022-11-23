const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { InvariantError, NotFoundError } = require('../../../common/exceptions')

class Songs {
  #name = 'songs'
  constructor () {
    this._pool = new Pool()
  }

  async add ({ title, year, genre, performer, duration = null, albumId = null }) {
    const id = `${this.#name}-${nanoid(16)}`

    const query = {
      text: `INSERT INTO ${this.#name} VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      return new InvariantError('An error occurred while saving data')
    }

    return result.rows[0].id
  }

  async getAll ({ title = '', performer = '' }) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`]
    }

    const result = await this._pool.query(query)

    return result.rows.map(song => ({ id: song.id, title: song.title, performer: song.performer }))
  }

  async getById (id) {
    const query = {
      text: `SELECT * FROM ${this.#name} WHERE id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'song', fieldName: 'id', request: id })
    }

    return result.rows.map(song => {
      const mapSong = { ...song, albumId: song.album_id }
      delete mapSong.album_id
      return mapSong
    })[0]
  }

  async update (id, { title, year, genre, performer, duration = null, albumId = null }) {
    const query = {
      text: `UPDATE ${this.#name} SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'song', fieldName: 'id', request: id })
    }
  }

  async delete (id) {
    const query = {
      text: `DELETE FROM ${this.#name} WHERE id = $1 RETURNING id`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'song', fieldName: 'id', request: id })
    }
  }

  async any (id) {
    const query = {
      text: `SELECT * FROM ${this.#name} WHERE id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'song', fieldName: 'id', request: id })
    }
  }
}

module.exports = Songs
