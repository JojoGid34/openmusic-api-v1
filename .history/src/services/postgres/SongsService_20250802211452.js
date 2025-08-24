const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBsongsModel } = require("../../utils/songsIndex");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration = null, albumId = null }) {
    const songId = "song-" + nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING "songId"',
      values: [songId, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].songId) {
      throw new InvariantError('Song gagal ditambahkan, mohon isi detailnya dengan benar');
    }

    return result.rows[0].songId;
  }

  async getSongs({ title, performer }) {
    let query = 'SELECT "songId", title, performer FROM songs'; // Hanya ambil kolom yang diminta
    const values = [];
    const conditions = [];
    let paramIndex = 1; // Untuk melacak nomor parameter

    if (title) {
      conditions.push(`title ILIKE $${paramIndex}`);
      values.push(`%${title}%`);
      paramIndex++;
    }

    if (performer) {
      conditions.push(`performer ILIKE $${paramIndex}`);
      values.push(`%${performer}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await this._pool.query(query, values);
    return result.rows.map(mapDBsongsModel);
    
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE "songId" = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song dengan Id tersebut tidak ditemukan');
    }

    return result.rows.map(mapDBsongsModel)[0];
  }

  async editSongById(songId, { title, year, genre, performer, duration = null, albumId = null }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE "songId" = $7 RETURNING "songId"',
      values: [title, year, genre, performer, duration, albumId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE "songId" = $1 RETURNING "songId"',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus song. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;