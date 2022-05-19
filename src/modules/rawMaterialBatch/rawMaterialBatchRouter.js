const { Router } = require('express');

const RawMaterialBatchService = require('./rawMaterialBatchService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const {
  getSchema,
  createSchema,
  querySchema,
} = require('./rawMaterialBatchDto');

const router = Router();
const rawMaterialBatchService = new RawMaterialBatchService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, order, type } = req.query;
      const rawMaterialBatches = await rawMaterialBatchService.findAll(
        limit,
        offset,
        order,
        type
      );
      res.status(200).json(rawMaterialBatches);
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
      const rawMaterialBatch = await rawMaterialBatchService.findById(id);
      res.status(200).json(rawMaterialBatch);
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
      const rawMaterialBatch = await rawMaterialBatchService.create(sub, data);
      res.status(201).json(rawMaterialBatch);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
