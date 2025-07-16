const mapDBsongsmodel = ({
  songid,
  title,
  year,
  genre,
  performer,
  duration,
  albumid,
}) => ({
  song_id: songid,
  title,
  year,
  genre,
  performer,
  duration,
  album_id: albumid,
});

module.exports = { mapDBsongsmodel };