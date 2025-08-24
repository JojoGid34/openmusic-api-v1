const mapDBplaylistsModel = ({
  playlistId,
  name,
  owner,
}) => ({
  id: playlistId,
  name,
  owner,
});

module.exports = { mapDBplaylistsModel };