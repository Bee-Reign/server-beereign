const Joi = require('joi');

const id = Joi.number().unsafe().min(1).max(9223372036854775807);
const productId = Joi.number().integer().positive().max(2147483647);
const warehouseId = Joi.number().integer().positive().max(32767);
const entryDate = Joi.date();
const expirationDate = Joi.date().allow(null);
const quantity = Joi.number().integer().positive();
const stock = Joi.number().integer().positive();
const unitCost = Joi.number().positive();
const batches = Joi.array();

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const order = Joi.string().alphanum().valid('DESC').valid('ASC');
const type = Joi.string()
  .alphanum()
  .valid('inStock')
  .valid('empty')
  .valid('inProcess')
  .valid('all');
const isOutput = Joi.boolean();

const getSchema = Joi.object({
  id: id.required(),
});

const createSchema = Joi.object({
  productId: productId.required(),
  warehouseId: warehouseId.required(),
  entryDate: entryDate.required(),
  expirationDate,
  quantity: quantity.required(),
  unitCost: unitCost.required(),
  batches: batches.required(),
});

const updateSchema = Joi.object({
  productId: productId.required(),
  warehouseId: warehouseId.required(),
  entryDate: entryDate.required(),
  expirationDate,
  quantity: quantity.required(),
  unitCost: unitCost.required(),
  stock: stock.required(),
});

const querySchema = Joi.object({
  limit,
  offset,
  order,
  type,
  isOutput,
});

module.exports = {
  getSchema,
  createSchema,
  updateSchema,
  querySchema,
};
