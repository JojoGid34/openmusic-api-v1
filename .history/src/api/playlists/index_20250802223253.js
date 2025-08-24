const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistsService, validator }) => {
    // Membuat instance handler, dengan menginjeksikan service dan validator
    const playlistsHandler = new PlaylistsHandler(playlistsService, validator);

    // Mendaftarkan routes ke server Hapi
    server.route(routes(playlistsHandler));
  },
};