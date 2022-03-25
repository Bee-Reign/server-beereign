const Joi = require('joi');

const id = Joi.number().integer().positive().max(32767);
const name = Joi.string().alphanum().min(2).max(50);
const description = Joi.string().max(255);

const createTypeOfEmployeeSchema = Joi.object({
  name: name.required(),
  description: description.required(),
});

const updateTypeOfEmployeeSchema = Joi.object({
  name: name.required(),
  description: description.required(),
});

const getTypeOfEmployeeSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createTypeOfEmployeeSchema,
  updateTypeOfEmployeeSchema,
  getTypeOfEmployeeSchema,
};
