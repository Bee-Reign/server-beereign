const Joi = require('joi');

const {
  config: { locale },
} = require('../../../app/config');
const Measurement = require('../model/enum/measurement');

const id = Joi.number().unsafe().min(1).max(9223372036854775807);
const rawMaterialId = Joi.number().integer().positive().max(2147483647);
const warehouseId = Joi.number().integer().positive().max(32767);
const entryDate = Joi.date();
const expirationDate = Joi.date().allow(null);
const measurement = Joi.string().valid(...Measurement[locale]);
const quantity = Joi.number().positive();
const stock = Joi.number().min(0);
const unitCost = Joi.number().positive();

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const order = Joi.string().alphanum().valid('DESC', 'ASC');
const type = Joi.string().alphanum().valid('inStock', 'empty', 'all');
const isPacking = Joi.boolean();

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
}).options({ abortEarly: false });

const updateSchema = Joi.object({
  rawMaterialId: rawMaterialId.required(),
  warehouseId: warehouseId.required(),
  entryDate: entryDate.required(),
  expirationDate,
  measurement: measurement.required(),
  quantity: quantity.required(),
  stock: stock.required(),
  unitCost: unitCost.required(),
}).options({ abortEarly: false });

const querySchema = Joi.object({
  limit,
  offset,
  order,
  type,
  isPacking,
});

module.exports = {
  getSchema,
  createSchema,
  updateSchema,
  querySchema,
};
