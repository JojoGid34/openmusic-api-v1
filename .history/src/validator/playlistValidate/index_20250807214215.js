const InvariantError = require("../../exceptions/InvariantError");
const {
  PostPlaylistPayloadRule,
  PostPlaylistSongPayloadRule,
  DeletePlaylistSongPayloadRule,
} = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostPlaylistSongPayload: (payload) => {
    const validationResult = PostPlaylistSongPayloadRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeletePlaylistSongPayload: (payload) => {
    const validationResult = DeletePlaylistSongPayloadRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
}

module.exports = PlaylistsValidator;