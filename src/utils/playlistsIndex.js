const mapDBplaylistsModel = ({
  playlistId,
  name,
  username,
}) => ({
  id: playlistId,
  name,
  username,
});

module.exports = { mapDBplaylistsModel };