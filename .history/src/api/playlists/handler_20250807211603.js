const autoBind = require("auto-bind");

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials; // Mendapatkan owner dari token
    const playlistId = await this._service.addPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(owner);
    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, owner);
    await this._service.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, owner);
    await this._service.addSongToPlaylist(playlistId, songId);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, owner);
    const playlist = await this._service.getSongsInPlaylist(playlistId);
    return {
      status: 'success',
      data: { playlist },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validateDeletePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, owner);
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;