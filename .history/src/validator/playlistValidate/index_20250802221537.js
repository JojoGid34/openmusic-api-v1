const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = PlaylistPayloadRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
}