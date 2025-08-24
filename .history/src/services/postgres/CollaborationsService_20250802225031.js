// src/services/postgres/CollaborationsService.js
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  // POST /collaborations
  async addCollaborator(playlistId, userId) {
    const userQuery = { text: 'SELECT userId FROM users WHERE userId = $1', values: [userId] };
    const userResult = await this._pool.query(userQuery);
    if (!userResult.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const playlistQuery = { text: 'SELECT playlistId FROM playlists WHERE playlistId = $1', values: [playlistId] };
    const playlistResult = await this._pool.query(playlistQuery);
    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    // Pastikan user belum menjadi collaborator di playlist tersebut
    const verifyQuery = { text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2', values: [playlistId, userId] };
    const verifyResult = await this._pool.query(verifyQuery);
    if (verifyResult.rows.length) {
      throw new InvariantError('Kolaborasi sudah ada');
    }

    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // DELETE /collaborations
  async deleteCollaborator(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  // Digunakan untuk verifikasi di endpoint Playlist
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = CollaborationsService;