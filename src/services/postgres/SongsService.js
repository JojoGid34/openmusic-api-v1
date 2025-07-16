const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBsongsmodel } = require("../../utils/songsIndex");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration = null, albumid = null }) {
    const song_id = "song-" + nanoid(16);

    const query = {
      text: 'INSERT INTO songs(songid, title, year, genre, performer, duration, albumid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING songid',
      values: [song_id, title, year, genre, performer, duration, albumid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Song gagal ditambahkan, mohon isi detailnya dengan benar');
    }

    return result.rows[0].songid;
  }

  async getSongs({ title, performer }) {
    let query = 'SELECT songid, title, performer FROM songs'; // Hanya ambil kolom yang diminta
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
    return result.rows.map(mapDBsongsmodel);
    
  }

  async getSongById(songid) {
    const query = {
      text: 'SELECT * FROM songs WHERE songid = $1',
      values: [songid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song dengan Id tersebut tidak ditemukan');
    }

    return result.rows.map(mapDBsongsmodel)[0];
  }

  async editSongById(songid, { title, year, genre, performer, duration = null, albumid = null }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumid = $6 WHERE songid = $7 RETURNING songid',
      values: [title, year, genre, performer, duration, albumid, songid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(songid) {
    const query = {
      text: 'DELETE FROM songs WHERE songid = $1 RETURNING songid',
      values: [songid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus song. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;