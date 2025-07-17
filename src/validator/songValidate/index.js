const InvariantError = require("../../exceptions/InvariantError");
const { SongPayloadRule, SongQueryRule } = require("./schema")

const SongsValidator = {
  validateSongsPayload: (payload) => { // POST/PUT
    const validationResult = SongPayloadRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongsQuery: (payload) => { // GET
    const validationResult = SongQueryRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = SongsValidator;