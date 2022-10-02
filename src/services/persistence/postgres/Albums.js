const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { InvariantError, NotFoundError } = require('../../../common/exceptions')

class Albums {
  #name = 'albums'
  constructor () {
    this._pool = new Pool()
  }

  async add ({ name, year }) {
    const id = nanoid(16)

    const query = {
      text: `INSERT INTO ${this.#name} VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, year]
    }
    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      return new InvariantError(`Failed to add new ${this.#name}`)
    }

    return result.rows[0].id
  }

  async getAll () {
    const result = await this._pool.query(`SELECT * FROM ${this.#name}`)
    return result.rows
  }

  async getById (id) {
    const query = {
      text: `SELECT * FROM ${this.#name} WHERE id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError({ entityName: 'album', fieldName: 'id', request: id })
    }

    return result.rows[0]
  }

  async update (id, { name, year }) {
    const query = {
      text: `UPDATE ${this.#name} SET name = $1, year = $2 WHERE id = $3 RETURNING id`,
      values: [name, year, id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError({ entityName: 'album', fieldName: 'id', request: id })
    }
  }

  async delete (id) {
    const query = {
      text: `DELETE FROM ${this.#name} WHERE id = $1 RETURNING id`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError({ entityName: 'album', fieldName: 'id', request: id })
    }
  }
}

module.exports = Albums
