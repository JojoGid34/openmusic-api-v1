const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService; // Digunakan nanti untuk collaborator
  }

  async addPlaylist({ name, owner }) {
    const playlistId = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING playlistId',
      values: [playlistId, name, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].playlistId) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].playlistId;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.playlistId, playlists.name, users.username FROM playlists
             LEFT JOIN users ON users.userId = playlists.owner
             WHERE playlists.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE playlistId = $1 RETURNING playlistId',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    // Verifikasi songId harus ada
    const songQuery = {
      text: 'SELECT songId FROM songs WHERE songId = $1',
      values: [songId],
    };
    const songResult = await this._pool.query(songQuery);

    if (!songResult.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const playlistsongId = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING playlistsongId',
      values: [playlistsongId, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].playlistsongId) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username,
             json_agg(json_build_object('id', songs.id, 'title', songs.title, 'performer', songs.performer)) AS songs
             FROM playlists
             LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
             LEFT JOIN songs ON songs.id = playlist_songs.song_id
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1
             GROUP BY playlists.id, users.username`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  // DELETE /playlists/{id}/songs
  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }

  // VERIFIKASI HAK AKSES
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;