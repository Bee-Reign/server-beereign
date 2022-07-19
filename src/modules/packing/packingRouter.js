const { Router } = require('express');

const PackingService = require('./packingService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const {
  getSchema,
  createSchema,
  createBatchSchema,
  suspendSchema,
  updateSchema,
  updateBatchSchema,
  querySchema,
} = require('./packingDto');

const router = Router();
const packingService = new PackingService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, order, type } = req.query;
      const packings = await packingService.findAll(limit, offset, order, type);
      res.status(200).json(packings);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const packing = await packingService.findById(id);
      res.status(200).json(packing);
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
      const { sub } = req.user;
      const data = req.body;
      const packing = await packingService.create(sub, data);
      res.status(201).json(packing);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/batch',
  validatorHandler(createBatchSchema, 'body'),
  async (req, res, next) => {
    try {
      const { sub } = req.user;
      const data = req.body;
      const packing = await packingService.createBatch(sub, data);
      res.status(201).json(packing);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/suspend',
  validatorHandler(suspendSchema, 'body'),
  async (req, res, next) => {
    try {
      const { sub } = req.user;
      const data = req.body;
      const packing = await packingService.suspend(sub, data);
      res.status(200).json(packing);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getSchema, 'params'),
  validatorHandler(updateSchema, 'body'),
  async (req, res, next) => {
    try {
      const { sub } = req.user;
      const { id } = req.params;
      const data = req.body;
      const packing = await packingService.update(id, sub, data);
      res.status(200).json(packing);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id/batch',
  validatorHandler(getSchema, 'params'),
  validatorHandler(updateBatchSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const packing = await packingService.updateBatch(id, data);
      res.status(200).json(packing);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
