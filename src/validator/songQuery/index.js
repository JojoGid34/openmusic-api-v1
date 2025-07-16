const InvariantError = require("../../exceptions/InvariantError");
const { SongQueryRule } = require("./schema");

const SongsQueryValidated = {
  validateSongsQuery: (payload) => {
    const validationResult = SongQueryRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = { SongsQueryValidated };