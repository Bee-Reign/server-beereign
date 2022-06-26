const { Router } = require('express');

const RawMaterialBatchService = require('../service/rawMaterialBatchService');
const validatorHandler = require('../../../app/middlewares/validatorHandler');

const {
  getSchema,
  createSchema,
  updateSchema,
  querySchema,
} = require('../schema/rawMaterialBatchDto');

const router = Router();
const rawMaterialBatchService = new RawMaterialBatchService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, order, type, rawMaterialId } = req.query;
      const rawMaterialBatches = await rawMaterialBatchService.findAll(
        limit,
        offset,
        order,
        type,
        rawMaterialId === 'null' ? null : rawMaterialId
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
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { isPacking } = req.query;
      const rawMaterialBatch = await rawMaterialBatchService.findById(
        id,
        isPacking == 'true'
      );
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

router.patch(
  '/:id',
  validatorHandler(getSchema, 'params'),
  validatorHandler(updateSchema, 'body'),
  async (req, res, next) => {
    try {
      const { sub } = req.user;
      const { id } = req.params;
      const data = req.body;
      const rawMaterialBatch = await rawMaterialBatchService.update(
        sub,
        id,
        data
      );
      res.status(200).json(rawMaterialBatch);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await rawMaterialBatchService.disableBatch(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
