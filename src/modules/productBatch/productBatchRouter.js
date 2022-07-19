const { Router } = require('express');

const ProductBatchService = require('./productBatchService');
const validatorHandler = require('../../app/middlewares/validatorHandler');

const {
  getSchema,
  querySchema,
} = require('./productBatchDto');

const router = Router();
const productBatchService = new ProductBatchService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, order, type, productId } = req.query;
      const productBatches = await productBatchService.findAll(
        limit,
        offset,
        order,
        type,
        productId === 'null' ? null : productId
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
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { isOutput } = req.query;
      const productBatch = await productBatchService.findById(
        id,
        isOutput == 'true'
      );
      res.status(200).json(productBatch);
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
      await productBatchService.disableBatch(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
