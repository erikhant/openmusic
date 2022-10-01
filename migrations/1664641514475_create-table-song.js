/* eslint-disable camelcase */
exports.up = pgm => {
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
      type: 'NUMERIC',
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
      type: 'NUMERIC',
      notNull: false
    },
    albumId: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"albums"',
      onDelete: 'cascade'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('songs')
}
