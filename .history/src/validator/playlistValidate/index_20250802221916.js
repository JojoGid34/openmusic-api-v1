const InvariantError = require("../../exceptions/InvariantError");
const { PostPlaylistPayloadRule } = require("./schema");

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = PostPlaylistPayloadRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  // TODO: Implement validation buat schema playlists lainnya
}

module.exports = PlaylistsValidator;