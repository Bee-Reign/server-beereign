const { Router } = require('express');

const ApiaryService = require('./apiaryService');
const validatorHandler = require('../../app/middlewares/validatorHandler');
const {
  getApiarySchema,
  createApiarySchema,
  updateApiarySchema,
  queryApiarySchema,
} = require('./apiaryDto');

const router = Router();
const apiaryService = new ApiaryService();

router.get(
  '/',
  validatorHandler(queryApiarySchema, 'query'),
  async (req, res, next) => {
    try {
      const { limit, offset, filter } = req.query;
      const apiaries = await apiaryService.findAll(limit, offset, filter);
      res.status(200).json(apiaries);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getApiarySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const apiary = await apiaryService.findById(id);
      res.status(200).json(apiary);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createApiarySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const apiary = await apiaryService.create(body);
      res.status(201).json(apiary);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getApiarySchema, 'params'),
  validatorHandler(updateApiarySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const apiary = await apiaryService.update(id, body);
      res.status(200).json(apiary);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getApiarySchema, 'params'),
  (req, res, next) => {
    try {
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
