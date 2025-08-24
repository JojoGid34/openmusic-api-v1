const Joi = require('joi');

const PostPlaylistPayloadRule = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistSongPayloadRule = Joi.object({
  songId: Joi.string().required(),
});

const DeletePlaylistSongPayloadRule = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistPayloadRule,
  PostPlaylistSongPayloadRule,
  DeletePlaylistSongPayloadRule,
};