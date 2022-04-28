const Joi = require('joi');

const id = Joi.number().integer().positive().max(32767);
const name = Joi.string().min(2).max(50);

const createCountrySchema = Joi.object({
  name: name.required(),
});

const updateCountrySchema = Joi.object({
  name: name.required(),
});

const getCountrySchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createCountrySchema,
  updateCountrySchema,
  getCountrySchema,
};
