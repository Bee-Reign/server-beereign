const { Router } = require('express');

const WarehouseService = require('./warehouseService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const {
  getWarehouseSchema,
  createWarehouseSchema,
  updateWarehouseSchema,
  querySchema,
} = require('./warehouseDto');

const router = Router();
const warehouseService = new WarehouseService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, filter } = req.query;
      const warehouses = await warehouseService.findAll(limit, offset, filter);
      res.status(200).json(warehouses);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getWarehouseSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const warehouse = await warehouseService.findById(id);
      res.status(200).json(warehouse);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createWarehouseSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;
      const warehouse = await warehouseService.create(data);
      res.status(201).json(warehouse);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getWarehouseSchema, 'params'),
  validatorHandler(updateWarehouseSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const warehouse = await warehouseService.update(id, data);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getWarehouseSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await warehouseService.disable(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
