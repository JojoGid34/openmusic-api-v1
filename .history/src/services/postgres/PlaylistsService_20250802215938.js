class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService; // Digunakan nanti untuk collaborator
  }

  // POST /playlists
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // GET /playlists
  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  // DELETE /playlists/{id}
  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  // POST /playlists/{id}/songs
  async addSongToPlaylist(playlistId, songId) {
    // Verifikasi songId harus ada
    const songQuery = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };
    const songResult = await this._pool.query(songQuery);

    if (!songResult.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  // GET /playlists/{id}/songs
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