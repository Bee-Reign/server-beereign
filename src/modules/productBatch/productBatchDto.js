const Joi = require('joi');

const id = Joi.number().unsafe().min(1).max(9223372036854775807);
const productId = Joi.number().integer().positive().max(2147483647);

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const order = Joi.string().alphanum().valid('DESC', 'ASC');
const type = Joi.string().alphanum().valid('inStock', 'empty', 'all');
const isOutput = Joi.boolean();

const getSchema = Joi.object({
  id: id.required(),
});

const querySchema = Joi.object({
  limit,
  offset,
  order,
  type,
  productId: productId.allow('null'),
  isOutput,
}).options({ abortEarly: false });

module.exports = {
  getSchema,
  querySchema,
};
