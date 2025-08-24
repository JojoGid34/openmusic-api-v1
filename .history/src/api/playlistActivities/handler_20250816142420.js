class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService) {
    this._service = playlistActivitiesService;
    this._playlistsService = playlistsService;
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

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