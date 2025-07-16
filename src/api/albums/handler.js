const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    const { payload } = request;
    this._validator.validateAlbumsPayload(payload);
    const albumid = await this._service.addAlbum(payload);

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
    const { albumid } = request.params;
    const { payload } = request;
    
    this._validator.validateAlbumsPayload(payload);
    
    await this._service.editAlbumById(albumid, payload);

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