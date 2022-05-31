const { Router } = require('express');

const validatorHandler = require('../../app/middlewares/validatorHandler');
const PackingService = require('./packingService');
const { querySchema, getSchema, updateSchema } = require('./packingDto');

const packingService = new PackingService();
const router = Router();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const allInProcess = await packingService.findAllInProcess(limit, offset);
      res.status(200).json(allInProcess);
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
      const inProcess = await packingService.findOneInProcessById(id);
      res.status(200).json(inProcess);
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
      const productBatch = await packingService.updateBatchSaved(sub, id, data);
      res.status(200).json(productBatch);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
