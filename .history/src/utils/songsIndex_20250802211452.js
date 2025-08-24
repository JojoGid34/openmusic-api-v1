const mapDBsongsModel = ({
  songId,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id: songId,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { mapDBsongsModel };