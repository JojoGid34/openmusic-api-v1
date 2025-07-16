const Joi = require("joi");

const SongQueryRule = Joi.object({
  title: Joi.string().optional(),
  performer: Joi.string().optional(),
});

module.exports = { SongQueryRule };