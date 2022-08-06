const Joi = require('joi');

const id = Joi.number().integer().positive().max(32767);
const name = Joi.string().max(50);
const countryId = Joi.number().positive().max(32767);
const provinceId = Joi.number().unsafe().min(1).max(9223372036854775807);
const city = Joi.string().max(50);
const location = Joi.object();

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const filter = Joi.string().min(0).max(100);

const getWarehouseSchema = Joi.object({
  id: id.required(),
});

const createWarehouseSchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
  provinceId: provinceId.required(),
  city: city.required(),
  location: location,
}).options({ abortEarly: false });

const updateWarehouseSchema = Joi.object({
  name: name.required(),
  countryId: countryId.required(),
  provinceId: provinceId.required(),
  city: city.required(),
  location: location,
}).options({ abortEarly: false });

const querySchema = Joi.object({
  limit,
  offset,
  filter,
});

module.exports = {
  getWarehouseSchema,
  createWarehouseSchema,
  updateWarehouseSchema,
  querySchema,
};
