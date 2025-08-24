const autoBind = require("auto-bind");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // ... Handler PUT dan DELETE di sini
}

module.exports = AuthenticationsHandler;