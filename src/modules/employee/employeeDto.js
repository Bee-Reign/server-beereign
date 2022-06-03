const Joi = require('joi');

const id = Joi.number().integer().positive();
const name = Joi.string().max(20);
const lastName = Joi.string().max(20);
const cellPhone = Joi.string().max(20).allow('');
const email = Joi.string().max(256).email();
const password = Joi.string().max(60).min(8);
const typeOfEmployeeId = Joi.number().integer().positive().max(32767);

const limit = Joi.number().integer().min(2);
const offset = Joi.number().integer().min(0);
const filter = Joi.string().min(0).max(25);
const update = Joi.string().alphanum().valid('profile').valid('acces');

const getEmployeeSchema = Joi.object({
  id: id.required(),
});

const createEmployeeSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  cellPhone,
  email: email.required(),
  password: password.required(),
  typeOfEmployeeId: typeOfEmployeeId.required(),
});

const updateEmployeeSchema = Joi.object({
  name: name,
  lastName: lastName,
  cellPhone: cellPhone,
  email: email,
  password: password,
  typeOfEmployeeId: typeOfEmployeeId,
});

const updateProfile = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  cellPhone: cellPhone,
  typeOfEmployeeId: typeOfEmployeeId.required(),
});

const updateLogin = Joi.object({
  email: email.required(),
  password: password.required(),
});

const queryEmployeeSchema = Joi.object({
  limit,
  offset,
  filter,
  update,
});

module.exports = {
  getEmployeeSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  updateProfile,
  updateLogin,
  queryEmployeeSchema,
};
