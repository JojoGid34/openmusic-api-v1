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
      text: 'INSERT INTO playlists("playlistId", name, owner) VALUES($1, $2, $3) RETURNING "playlistId"',
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
      text: `SELECT playlists."playlistId", playlists.name, users.username FROM playlists
             LEFT JOIN collaborations ON collaborations."playlistId" = playlists."playlistId"
             LEFT JOIN users ON users."userId" = playlists.owner
             WHERE playlists.owner = $1 OR collaborations."userId" = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const queryDeleteSongs = {
      text: 'DELETE FROM playlist_songs WHERE "playlistId" = $1',
      values: [playlistId],
    };
    await this._pool.query(queryDeleteSongs);
    
    const query = {
      text: 'DELETE FROM playlists WHERE "playlistId" = $1 RETURNING "playlistId"',
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
      text: 'SELECT "songId" FROM songs WHERE "songId" = $1',
      values: [songId],
    };
    const songResult = await this._pool.query(songQuery);

    if (!songResult.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const playlistsongId = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING "playlistsongId"',
      values: [playlistsongId, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].playlistsongId) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.playlistId, playlists.name, users.username,
             json_agg(json_build_object('id', songs.songId, 'title', songs.title, 'performer', songs.performer)) AS songs
             FROM playlists
             LEFT JOIN playlist_songs ON playlist_songs.playlistId = playlists.playlistId
             LEFT JOIN songs ON songs.songId = playlist_songs.songId
             LEFT JOIN users ON users.userId = playlists.owner
             WHERE playlists.playlistId = $1
             GROUP BY playlists.playlistId, users.username`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlistId = $1 AND songId = $2 RETURNING playlistsongId',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }

  // VERIFIKASI PEMILIK PLAYLIST
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE playlistId = $1',
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


  // VERIFIKASI HAK AKSES
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistAccess(playlistId, userId); //TODO: Recursive
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;