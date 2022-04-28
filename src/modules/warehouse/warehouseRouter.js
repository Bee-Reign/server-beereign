const { Router } = require('express');

const WarehouseService = require('./warehouseService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const {
  getWarehouseSchema,
  createWarehouseSchema,
  updateWarehouseSchema,
} = require('./warehouseDto');

const router = Router();
const warehouseService = new WarehouseService();

router.get('/', async (req, res, next) => {
  try {
    const warehouses = await warehouseService.findAll();
    res.status(200).json(warehouses);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getWarehouseSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const warehouse = await warehouseService.findById(id);
      return warehouse;
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
      res.status(201).json({
        id: warehouse.id,
        name: warehouse.name,
        createdAt: warehouse.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/',
  validatorHandler(getWarehouseSchema, 'params'),
  validatorHandler(updateWarehouseSchema, 'body'),
  async (req, res, next) => {
    try {
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/',
  validatorHandler(getWarehouseSchema, 'params'),
  async (req, res, next) => {
    try {
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
