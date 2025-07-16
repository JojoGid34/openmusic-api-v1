const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { name = 'untitled', year } = request.payload;

    const albumid = await this._service.addAlbum({name, year});

    const response = h.response({
      status: 'success',
      data: {
        albumid,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { albumid } = request.params;
    const album = await this._service.getAlbumById(albumid);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumsPayload(request.payload);
    const { albumid } = request.params;
    
    await this._service.editAlbumById(albumid, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil di-update',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumid } = request.params;
    
    await this._service.deleteAlbumById(albumid);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;