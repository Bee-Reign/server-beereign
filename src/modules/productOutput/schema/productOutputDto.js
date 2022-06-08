const Joi = require('joi');

const {
  config: { locale },
} = require('../../../app/config');
const TypeOfSale = require('../model/enum/typeOfSale');

const id = Joi.number().unsafe().min(1).max(9223372036854775807);
const amount = Joi.number().unsafe().positive();
const typeOfSale = Joi.string().valid(...TypeOfSale[locale]);
const isPaid = Joi.boolean();
const batches = Joi.array();

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);

const getSchema = Joi.object({
  id: id.required(),
});

const createSchema = Joi.object({
  amount: amount.required(),
  typeOfSale: typeOfSale.required(),
  batches: batches.required(),
});

const updateOutputIsPaid = Joi.object({
  isPaid: isPaid.required(),
});

const querySchema = Joi.object({
  limit,
  offset,
  typeOfSale,
  isPaid,
});

module.exports = {
  getSchema,
  createSchema,
  updateOutputIsPaid,
  querySchema,
};
