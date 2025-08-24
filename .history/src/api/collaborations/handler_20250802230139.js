const { ClientError } = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    const collaborationId = await this._collaborationsService.addCollaborator(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: { collaborationId },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateDeleteCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._collaborationsService.deleteCollaborator(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}