/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE songs (
      "songId" VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      year SMALLINT NOT NULL,
      genre VARCHAR(255) NOT NULL,
      performer VARCHAR(255) NOT NULL,
      duration INT,
      "albumId" VARCHAR(50),
      CONSTRAINT fk_songalbum FOREIGN KEY ("albumId") REFERENCES albums("albumId") ON DELETE CASCADE
    );  
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE songs;
  `);
};
