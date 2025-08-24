const mapDBusersModel = ({
  userId,
  username,
  fullname,
}) => ({
  id: userId,
  username, 
  fullname,
});

module.exports = { mapDBusersModel };