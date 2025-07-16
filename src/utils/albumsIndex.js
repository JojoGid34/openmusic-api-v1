const mapDBalbumsModel = ({
  albumid,
  name,
  year,
}) => ({
  album_id: albumid,
  name,
  year,
});

module.exports = { mapDBalbumsModel };