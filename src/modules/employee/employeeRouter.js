const { Router } = require('express');

const EmployeeService = require('./EmployeeService');
const validatorHandler = require('../../app/middlewares/validatorHandler');
const {
  getEmployeeSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeLoginSchema,
} = require('./EmployeeDto');

const router = Router();
const employeeService = new EmployeeService();

router.get('/', async (req, res, next) => {
  try {
    const employees = await employeeService.findAll();
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

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
      res.status(201).json({
        id: employee.id,
        name: employee.name,
        lastName: employee.lastName,
        cellPhone: employee.cellPhone,
        email: employee.email,
        createdAt: employee.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getEmployeeSchema, 'params'),
  validatorHandler(updateEmployeeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, password, createdAt, deleted, ...data } = req.body;
      const employee = await employeeService.update(id, data);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
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

module.exports = router;
