const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
  }, 
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{albumid}',
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{albumid}',
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{albumid}',
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = routes;