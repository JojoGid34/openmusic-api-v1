const Joi = require('joi');

const SongPayloadRule = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().optional().allow(null),
  albumId: Joi.string().optional().allow(null),
});

const SongQueryRule = Joi.object({
  title: Joi.string().optional().allow(null),
  performer: Joi.string().optional().allow(null),
});

module.exports = { SongPayloadRule, SongQueryRule };