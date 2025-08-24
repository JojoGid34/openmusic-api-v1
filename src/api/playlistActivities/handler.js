const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService) {
    this._service = playlistActivitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const activities = await this._service.getActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;