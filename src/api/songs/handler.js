const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const { title = 'untitled', year, genre, performer, duration, albumid } = request.payload;
    
    const songid = await this._service.addSong({ title, year, genre, performer, duration, albumid });

    const response = h.response({
      status: 'success',
      data: {
        songid,
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
    const { songid } = request.params;
    const song = await this._service.getSongById(songid);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongsPayload(request.payload);
    const { songid } = request.params;

    await this._service.editSongById(songid, request.payload);

    return {
      status: 'success',
      message: 'Song berhasil di-update',
    };
  }

  async deleteSongByIdHandler(request) {
    const { songid } = request.params;
    await this._service.deleteSongById(songid);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;