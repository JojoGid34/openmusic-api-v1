const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities("activityId", "playlistId", "songId", "userId", action, time) VALUES($1, $2, $3, $4, $5, $6) RETURNING "activityId"',
      values: [id, playlistId, songId, userId, action, time],
    };
    await this._pool.query(query);
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
           FROM playlist_song_activities
           LEFT JOIN users ON users."userId" = playlist_song_activities."userId"
           LEFT JOIN songs ON songs."songId" = playlist_song_activities."songId"
           WHERE playlist_song_activities."playlistId" = $1
           ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;

