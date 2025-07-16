/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE songs (
      songid VARCHAR(50) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      year INT NOT NULL,
      genre VARCHAR(200) NOT NULL,
      performer VARCHAR(200) NOT NULL,
      duration INT,
      albumid VARCHAR(50),
      CONSTRAINT fk_songalbum FOREIGN KEY (albumid) REFERENCES albums(albumid) ON DELETE CASCADE
    );  
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE songs;
  `);
};
