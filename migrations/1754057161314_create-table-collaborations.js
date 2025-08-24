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
    CREATE TABLE collaborations (
      "collaborationId" VARCHAR(50) PRIMARY KEY,
      "playlistId" VARCHAR(50) NOT NULL,
      "userId" VARCHAR(50) NOT NULL,
      CONSTRAINT fk_collaboration_playlistId FOREIGN KEY ("playlistId") REFERENCES playlists("playlistId") ON DELETE CASCADE,
      CONSTRAINT fk_collaboration_userId FOREIGN KEY ("userId") REFERENCES users("userId") ON DELETE CASCADE,
      UNIQUE ("playlistId", "userId")
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
    DROP TABLE collaborations;
  `);
};
