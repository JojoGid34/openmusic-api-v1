const InvariantError = require("../../exceptions/InvariantError");
const { AlbumPayloadRule } = require("./schema")

const AlbumsPayloadValidated = {
  validateAlbumsPayload: (payload) => {
    const validationResult = { AlbumPayloadRule }.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsPayloadValidated;