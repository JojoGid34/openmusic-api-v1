const mapDBusersModel = ({
  userId,
  username,
  password,
  fullname,
}) => ({
  id: userId,
  username,
  password,
  fullname,
});

module.exports = { mapDBusersModel };