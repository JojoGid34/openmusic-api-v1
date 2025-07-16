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
    const albumId = "album-" + nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING "albumId"',
      values: [albumId, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].albumId) {
      throw new InvariantError('Album gagal ditambahkan, mohon isi detailnya dengan benar');
    }

    return result.rows[0].albumId;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBalbumsModel);
  }

  async getAlbumById(albumId) {
    // Data album
    const albumQuery = {
      text: 'SELECT * FROM albums WHERE "albumId" = $1',
      values: [albumId],
    };

    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album dengan Id tersebut tidak ditemukan');
    }

    const album = albumResult.rows.map(mapDBalbumsModel)[0];

    // Data songs terkait album itu
    const songsQuery = {
      text: 'SELECT * FROM songs WHERE "albumId" = $1',
      values: [albumId],
    };

    const songsResult = await this._pool.query(songsQuery);

    // Gabungkan hasilnya
    return {
      ...album,
      songs: songsResult.rows.map(song => ({
        id: song.songId, // Sesuaikan dengan nama kolom database songId
        title: song.title,
        performer: song.performer,
      })),
    };
  }

  async editAlbumById(albumId, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE "albumId" = $3 RETURNING "albumId"',
      values: [name, year, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(albumId) {
    const query = {
      text: 'DELETE FROM albums WHERE "albumId" = $1 RETURNING "albumId"',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;