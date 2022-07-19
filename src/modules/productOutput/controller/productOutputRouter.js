const { Router } = require('express');

const ProductOutputService = require('../service/productOutputService');
const validatorHandler = require('../../../app/middlewares/validatorHandler');
const {
  createSchema,
  getSchema,
  querySchema,
  updateOutputIsPaid,
} = require('../schema/productOutputDto');

const router = Router();
const productOutputService = new ProductOutputService();

router.get(
  '/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, typeOfSale, isPaid } = req.query;
      const Outputs = await productOutputService.findAll(
        limit,
        offset,
        typeOfSale,
        isPaid
      );
      res.status(200).json(Outputs);
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
      const productOutput = await productOutputService.create(sub, data);
      res.status(201).json(productOutput);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getSchema, 'params'),
  validatorHandler(updateOutputIsPaid, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const productOutput = await productOutputService.updateOutputIsPaid(
        id,
        data
      );
      res.status(200).json(productOutput);
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
      await productOutputService.cancellOutput(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
