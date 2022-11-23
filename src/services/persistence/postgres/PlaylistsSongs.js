const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { InvariantError, NotFoundError } = require('../../../common/exceptions')

class PlaylistsSongs {
  #name = 'playlists_songs'
  constructor () {
    this._pool = new Pool()
  }

  async add (playlistId, songId) {
    const id = `ps-${nanoid(16)}`

    const query = {
      text: `INSERT INTO ${this.#name} VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('An error occurred while saving data')
    }
  }

  async getById (playlistId) {
    const playlistQuery = {
      text: `SELECT DISTINCT ON (playlists.id) playlists.id, playlists.name, users.username FROM ${this.#name} LEFT JOIN playlists ON playlists.id = playlist_id LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1`,
      values: [playlistId]
    }

    const resultPlaylist = await this._pool.query(playlistQuery)

    if (!resultPlaylist.rowCount) {
      throw new NotFoundError({ entityName: 'playlist', fieldName: 'id', request: playlistId })
    }

    const playlistsSongs = resultPlaylist.rows[0]

    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM ${this.#name} LEFT JOIN songs ON ${this.#name}.song_id = songs.id WHERE ${this.#name}.playlist_id = $1`,
      values: [playlistId]
    }

    const songResult = await this._pool.query(songQuery)

    playlistsSongs.songs = songResult.rows

    return playlistsSongs
  }

  async delete (songId) {
    const query = {
      text: `DELETE FROM ${this.#name} WHERE song_id = $1`,
      values: [songId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('An error occurred while deleting data')
    }
  }
}

module.exports = PlaylistsSongs
