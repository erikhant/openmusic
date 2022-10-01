/* eslint-disable camelcase */
exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    }
  })

  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    },
    genre: {
      type: 'VARCHAR',
      notNull: true
    },
    performer: {
      type: 'VARCHAR',
      notNull: true
    },
    duration: {
      type: 'INTEGER',
      notNull: false
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"albums"',
      onDelete: 'cascade'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('songs')
  pgm.dropTable('albums')
}
