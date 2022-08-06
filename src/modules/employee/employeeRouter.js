const { Router } = require('express');

const EmployeeService = require('./employeeService');
const validatorHandler = require('../../app/middlewares/validatorHandler');
const {
  getEmployeeSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  queryEmployeeSchema,
  updatePasswordSchema,
} = require('./employeeDto');

const router = Router();
const employeeService = new EmployeeService();

router.get(
  '/',
  validatorHandler(queryEmployeeSchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, filter } = req.query;
      const employees = await employeeService.findAll(limit, offset, filter);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getEmployeeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const employee = await employeeService.findById(id);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createEmployeeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { createdAt, deleted, ...data } = req.body;
      const employee = await employeeService.create(data);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getEmployeeSchema, 'params'),
  validatorHandler(queryEmployeeSchema, 'query'),
  validatorHandler(updateEmployeeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { update } = req.query;
      const { createdAt, deleted, ...data } = req.body;
      const employee = await employeeService.update(id, update, data);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id/password',
  validatorHandler(getEmployeeSchema, 'params'),
  validatorHandler(updatePasswordSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const employee = await employeeService.updatePassword(id, data.password);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id/disable',
  validatorHandler(getEmployeeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await employeeService.disableEmployee(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id/enable',
  validatorHandler(getEmployeeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await employeeService.enableEmployee(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
