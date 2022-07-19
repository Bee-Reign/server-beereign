const { Router } = require('express');

const TypeOfEmployeeService = require('./typeOfEmployeeService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const {
  getByIdSchema,
  createSchema,
  updateSchema,
  querySchema,
} = require('./typeOfEmployeeDto');

const router = Router();
const typeOfEmployeeService = new TypeOfEmployeeService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, filter } = req.query;
      const typesOfEmployee = await typeOfEmployeeService.findAll(
        limit,
        offset,
        filter
      );
      res.status(200).json(typesOfEmployee);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id/modules',
  validatorHandler(getByIdSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const modules =
        await typeOfEmployeeService.findAllModulesByTypeOfEmployee(id);
      res.status(200).json(modules);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getByIdSchema, 'params'),
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
  validatorHandler(createSchema, 'body'),
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
  validatorHandler(getByIdSchema, 'params'),
  validatorHandler(updateSchema, 'body'),
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
  validatorHandler(getByIdSchema, 'params'),
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
