const InvariantError = require("../../exceptions/InvariantError");
const UserPayloadRule = require("./schema");

const UsersValidator = {
  validateUsersPayload: (payload) => {
    const validationResult = UserPayloadRule.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = UsersValidator;