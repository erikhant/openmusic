const { Pool } = require('pg')
const { nanoid } = require('nanoid')
// const { mapDBToModel } = require('../../../common/utils')
const { InvariantError, NotFoundError } = require('../../../common/exceptions')

class Songs {
  #name = 'songs'
  constructor () {
    this._pool = new Pool()
  }

  async add ({ title, year, genre, performer, duration = null, albumId = null }) {
    const id = nanoid(16)

    const query = {
      text: `INSERT INTO ${this.#name} VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId]
    }
    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      return new InvariantError(`Failed to add new ${this.#name}`)
    }

    return result.rows[0].id
  }

  async getAll () {
    const result = await this._pool.query(`SELECT * FROM ${this.#name}`)
    console.log(result)
    return result.rows
  }

  async getById (id) {
    const query = {
      text: `SELECT * FROM ${this.#name} WHERE id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError({ entityName: 'song', fieldName: 'id', request: id })
    }

    return result.rows[0]
  }

  async update (id, { title, year, genre, performer, duration = null, albumId }) {
    const query = {
      text: `UPDATE ${this.#name} SET title = $1, year = $2 genre = $3, performer = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration !== null ? duration : 'NULL', albumId !== null ? albumId : 'NULL', id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError({ entityName: 'song', fieldName: 'id', request: id })
    }
  }

  async delete (id) {
    const query = {
      text: `DELETE FROM ${this.#name} WHERE id = $1 RETURNING id`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError({ entityName: 'song', fieldName: 'id', request: id })
    }
  }
}

module.exports = Songs
