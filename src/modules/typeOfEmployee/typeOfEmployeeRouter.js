const { Router } = require('express');

const TypeOfEmployeeService = require('./typeOfEmployeeService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const {
  getTypeOfEmployeeSchema,
  createTypeOfEmployeeSchema,
  updateTypeOfEmployeeSchema,
} = require('./typeOfEmployeeDto');

const router = Router();
const typeOfEmployeeService = new TypeOfEmployeeService();

router.get('/', async (req, res, next) => {
  try {
    const typesOfEmployee = await typeOfEmployeeService.findAll();
    res.status(200).json(typesOfEmployee);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getTypeOfEmployeeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const typeOfEmployee = await typeOfEmployeeService.findById(id);
      res.status(200).json(typeOfEmployee);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createTypeOfEmployeeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { deleted, ...data } = req.body;
      const typeOfEmployee = await typeOfEmployeeService.create(data);
      res.status(201).json({
        id: typeOfEmployee.id,
        name: typeOfEmployee.name,
        description: typeOfEmployee.description,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getTypeOfEmployeeSchema, 'params'),
  validatorHandler(updateTypeOfEmployeeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { deleted, ...data } = req.body;
      const typeOfEmployee = await typeOfEmployeeService.update(id, data);
      res.status(200).json(typeOfEmployee);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getTypeOfEmployeeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await typeOfEmployeeService.disable(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
