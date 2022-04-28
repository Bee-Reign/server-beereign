const Joi = require('joi');

const id = Joi.number().unsafe().max(9223372036854775807);
const name = Joi.string().max(30);
const countryId = Joi.number().positive().max(32767);
const provinceId = Joi.number().unsafe().max(9223372036854775807);
const city = Joi.string().max(50);
const location = Joi.object();

const getWarehouseSchema = Joi.object({
  id: id.required(),
});

const createWarehouseSchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
  provinceId: provinceId.required(),
  city: city.required(),
  location: location,
});

const updateWarehouseSchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
  provinceId: provinceId.required(),
  city: city.required(),
  location: location,
});

module.exports = {
  getWarehouseSchema,
  createWarehouseSchema,
  updateWarehouseSchema,
};
