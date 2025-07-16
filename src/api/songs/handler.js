const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const { title = 'untitled', year, genre, performer, duration, albumId } = request.payload;
    
    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    this._validator.validateSongsQuery({ title, performer });
    const { title, performer } = request.query;

    const songs = await this._service.getSongs({ title, performer });

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });

    return response;
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params;
    const song = await this._service.getSongById(songId);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongsPayload(request.payload);
    const { songId } = request.params;

    await this._service.editSongById(songId, request.payload);

    return {
      status: 'success',
      message: 'Song berhasil di-update',
    };
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params;
    await this._service.deleteSongById(songId);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;