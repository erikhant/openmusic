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
      type: 'NUMERIC',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('albums')
}
