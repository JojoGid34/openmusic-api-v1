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
    CREATE TABLE playlist_songs (
      "playlistsongId" VARCHAR(50) PRIMARY KEY,
      "playlistId" VARCHAR(50) NOT NULL,
      "songId" VARCHAR(50) NOT NULL,
      PRIMARY KEY ("playlistId", "songId"),
      CONSTRAINT fk_playlistsong_playlistId FOREIGN KEY ("playlistId") REFERENCES playlists("playlistId") ON DELETE CASCADE,
      CONSTRAINT fk_playlistsong_songId FOREIGN KEY ("songId") REFERENCES songs("songId") ON DELETE CASCADE
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
    DROP TABLE playlist_songs;
  `);
};
