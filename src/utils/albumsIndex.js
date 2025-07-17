const mapDBalbumsModel = ({
  albumId,
  name,
  year,
}) => ({
  id: albumId,
  name,
  year,
});

module.exports = { mapDBalbumsModel };