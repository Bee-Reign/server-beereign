const Joi = require('Joi');

const id = Joi.number().unsafe().min(1).max(9223372036854775807);
const rawMaterialId = Joi.number().integer().positive().max(2147483647);
const warehouseId = Joi.number().integer().positive().max(32767);
const entryDate = Joi.date();
const expirationDate = Joi.date().allow(null);
const measurement = Joi.string()
  .alphanum()
  .valid("GALONES")
  .valid("GRAMOS")
  .valid("KILOGRAMOS")
  .valid("LIBRAS")
  .valid("LITROS")
  .valid("ONZAS")
  .valid("UNIDADES");
const quantity = Joi.number().positive();
const unitCost = Joi.number().positive();
const stock = Joi.number().positive();

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const order = Joi.string().alphanum().valid('DESC').valid('ASC');
const type = Joi.string()
  .alphanum()
  .valid('inStock')
  .valid('empty')
  .valid('all');

const getSchema = Joi.object({
  id: id.required(),
});

const createSchema = Joi.object({
  rawMaterialId: rawMaterialId.required(),
  warehouseId: warehouseId.required(),
  entryDate: entryDate.required(),
  expirationDate,
  measurement: measurement.required(),
  quantity: quantity.required(),
  unitCost: unitCost.required(),
});

const querySchema = Joi.object({
  limit,
  offset,
  order,
  type,
});

module.exports = {
  getSchema,
  createSchema,
  querySchema,
};
