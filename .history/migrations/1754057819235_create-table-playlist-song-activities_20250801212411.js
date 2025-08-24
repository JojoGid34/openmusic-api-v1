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
    CREATE TABLE playlist_song_activities (
      "activityId" VARCHAR(50) PRIMARY KEY,
      "playlistId" VARCHAR(50) NOT NULL,
      "songId" VARCHAR(50) NOT NULL,
      "userId" VARCHAR(50) NOT NULL,
      action VARCHAR(50) NOT NULL,
      timestamp TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_activity_playlistId FOREIGN KEY ("playlistId") REFERENCES playlists("playlistId") ON DELETE CASCADE,
      CONSTRAINT fk_activity_userId FOREIGN KEY ("userId") REFERENCES users("userId") ON DELETE CASCADE,
      CONSTRAINT fk_activity_songId FOREIGN KEY ("songId") REFERENCES songs("songId") ON DELETE CASCADE,
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
    DROP TABLE playlist_song_activities;
  `);
};
