const Joi = require('joi');

const id = Joi.number().unsafe().max(9223372036854775807);
const name = Joi.string().min(2).max(50);
const countryId = Joi.number().integer().positive().max(32767);
const provinceId = Joi.number().unsafe().max(9223372036854775807);
const city = Joi.string().max(50);
const location = Joi.object();

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const filter = Joi.string().min(0).max(25);

const getApiarySchema = Joi.object({
  id: id.required(),
});

const createApiarySchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
  provinceId: provinceId.required(),
  city: city.required(),
  location: location,
});

const updateApiarySchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
  provinceId: provinceId.required(),
  city: city.required(),
  location: location,
});

const queryApiarySchema = Joi.object({
  limit,
  offset,
  filter,
});

module.exports = {
  getApiarySchema,
  createApiarySchema,
  updateApiarySchema,
  queryApiarySchema,
};
