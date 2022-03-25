const Joi = require('joi');

const id = Joi.number().min(1).max(9223372036854775807);
const name = Joi.string().max(30);
const lastName = Joi.string().max(30);
const cellPhone = Joi.string().max(20);
const email = Joi.string().max(256).email();
const password = Joi.string().max(60).min(8);
const typeOfEmployeeId = Joi.number().integer().positive().max(32767);

const getEmployeeSchema = Joi.object({
  id: id.required(),
});

const createEmployeeSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  cellPhone: cellPhone,
  email: email.required(),
  password: password.required(),
  typeOfEmployeeId: typeOfEmployeeId.required(),
});

const updateEmployeeSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  cellPhone: cellPhone,
  typeOfEmployeeId: typeOfEmployeeId.required(),
});

const updateEmployeeLoginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

module.exports = {
  getEmployeeSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeLoginSchema,
};
