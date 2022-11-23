const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const { InvariantError, NotFoundError, AuthenticationError, AlreadyExistsError } = require('../../../common/exceptions')

class Users {
  #name = 'users'
  constructor () {
    this._pool = new Pool()
  }

  async add ({ username, password, fullname }) {
    await this.verifyNewUsername(username)

    const id = `${this.#name}-${nanoid(16)}`
    const hashedPassword = await bcrypt.hash(password, 10)
    const query = {
      text: `INSERT INTO ${this.#name} VALUES($1, $2, $3, $4) RETURNING id`,
      values: [id, username, hashedPassword, fullname]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError(`An error occurred while saving ${this.#name} data`)
    }
    return result.rows[0].id
  }

  async getById (userId) {
    const query = {
      text: `SELECT id, username, fullname FROM ${this.#name} WHERE id = $1`,
      values: [userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'user', fieldName: 'id', request: userId })
    }

    return result.rows[0]
  }

  async any (userId) {
    const query = {
      text: `SELECT id, username, fullname FROM ${this.#name} WHERE id = $1`,
      values: [userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError({ entityName: 'user', fieldName: 'id', request: userId })
    }
  }

  async verifyNewUsername (username) {
    const query = {
      text: `SELECT username FROM ${this.#name} WHERE username = $1`,
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount > 0) {
      throw new AlreadyExistsError({ entityName: 'user', fieldName: 'id', request: username })
    }
  }

  async verifyCredential (username, password) {
    const query = {
      text: `SELECT id, password FROM ${this.#name} WHERE username = $1`,
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthenticationError()
    }

    const { id, password: hashedPassword } = result.rows[0]

    const match = await bcrypt.compare(password, hashedPassword)

    if (!match) {
      throw new AuthenticationError()
    }
    return id
  }
}

module.exports = Users
