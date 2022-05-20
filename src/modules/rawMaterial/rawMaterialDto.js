const Joi = require('joi');

const id = Joi.number().integer().positive().max(2147483647);
const code = Joi.string().max(12).alphanum();
const name = Joi.string().max(100);

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const filter = Joi.string().min(0).max(100);

const getRawMaterialSchema = Joi.object({
  id: id.required(),
});

const createRawMaterialSchema = Joi.object({
  code: code,
  name: name.required(),
});

const updateRawMaterialSchema = Joi.object({
  code: code,
  name: name.required(),
});

const querySchema = Joi.object({
  limit,
  offset,
  filter,
});

module.exports = {
  getRawMaterialSchema,
  createRawMaterialSchema,
  updateRawMaterialSchema,
  querySchema,
};
