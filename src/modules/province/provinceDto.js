const Joi = require('joi');

const id = Joi.number().unsafe().max(9223372036854775807);
const name = Joi.string().min(2).max(50);
const countryId = Joi.number().integer().positive().max(32767);

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);

const createProvinceSchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
});

const updateProvinceSchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
});

const getProvinceSchema = Joi.object({
  id: id.required(),
});

const queryProvinceSchema = Joi.object({
  limit,
  offset,
});

module.exports = {
  getProvinceSchema,
  createProvinceSchema,
  updateProvinceSchema,
  queryProvinceSchema,
};
