const Joi = require('joi');

const id = Joi.number().integer().positive().max(2147483647);
const barcode = Joi.string().max(128).alphanum();
const name = Joi.string().max(100);
const description = Joi.string().max(255).allow('');

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const filter = Joi.string().min(0).max(100);
const type = Joi.string().alphanum().valid('id', 'barcode');

const getSchema = Joi.object({
  id: Joi.string().required(),
});

const createSchema = Joi.object({
  barcode: barcode.required(),
  name: name.required(),
  description,
}).options({ abortEarly: false });

const updateSchema = Joi.object({
  barcode: barcode.required(),
  name: name.required(),
  description,
}).options({ abortEarly: false });

const querySchema = Joi.object({
  limit,
  offset,
  filter,
  type,
});

module.exports = {
  getSchema,
  createSchema,
  updateSchema,
  querySchema,
};
