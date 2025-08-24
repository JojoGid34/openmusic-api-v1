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
    CREATE TABLE playlist_songs (
      "playlistsongId" VARCHAR(50) PRIMARY KEY,
      "playlistId" VARCHAR(50) NOT NULL,
      "songId" VARCHAR(50) NOT NULL,
      UNIQUE ("playlistId", "songId"),
      CONSTRAINT fk_playlistsong_playlistId FOREIGN KEY ("playlistId") REFERENCES playlists("playlistId") ON DELETE CASCADE,
      CONSTRAINT fk_playlistsong_songId FOREIGN KEY ("songId") REFERENCES songs("songId") ON DELETE CASCADE,
      UNIQUE ("playlistId", "songId")
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
    DROP TABLE playlist_songs;
  `);
};
