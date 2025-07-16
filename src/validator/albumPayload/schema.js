const Joi = require("joi");

const AlbumPayloadRule = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
})

module.exports = { AlbumPayloadRule };