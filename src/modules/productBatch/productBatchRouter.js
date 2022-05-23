const { Router } = require('express');

const ProductBatchService = require('./productBatchService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const { getSchema, createSchema, querySchema } = require('./productBatchDto');

const router = Router();
const productBatchService = new ProductBatchService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, order, type } = req.query;
      const productBatches = await productBatchService.findAll(
        limit,
        offset,
        order,
        type
      );
      res.status(200).json(productBatches);
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
      const productBatch = await productBatchService.findById(id);
      res.status(200).json(productBatch);
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
      const productBatch = await productBatchService.create(sub, data);
      res.status(201).json(productBatch);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
