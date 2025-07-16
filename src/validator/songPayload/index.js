const InvariantError = require("../../exceptions/InvariantError");
const { SongPayloadRule } = require("./schema")

const SongsPayloadValidated = {
  validateSongsPayload: (payload) => {
    const validationResult = { SongPayloadRule }.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { SongsPayloadValidated };