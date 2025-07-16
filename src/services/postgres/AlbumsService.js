const { nanoid } = require("nanoid/non-secure");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBalbumsModel } = require("../../utils/albumsIndex");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const album_id = "album-" + nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING albumid',
      values: [album_id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal ditambahkan, mohon isi detailnya dengan benar');
    }

    return result.rows[0].albumid;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBalbumsModel);
  }

  async getAlbumById(albumid) {
    // Data album
    const albumQuery = {
      text: 'SELECT * FROM albums WHERE albumid = $1',
      values: [albumid],
    };

    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album dengan Id tersebut tidak ditemukan');
    }

    const album = albumResult.rows.map(mapDBalbumsModel)[0];

    // Data songs terkait album itu
    const songsQuery = {
      text: 'SELECT * FROM songs WHERE albumid = $1',
      values: [albumid],
    };

    const songsResult = await this._pool.query(songsQuery);

    // Gabungkan hasilnya
    return {
      ...album,
      songs: songsResult.rows.map(song => ({
        id: song.songid, // Sesuaikan dengan nama kolom database songId
        title: song.title,
        performer: song.performer,
      })),
    };
  }

  async editAlbumById(albumid, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE albumid = $3 RETURNING albumid',
      values: [name, year, albumid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(albumid) {
    const query = {
      text: 'DELETE FROM albums WHERE albumid = $1 RETURNING albumid',
      values: [albumid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;