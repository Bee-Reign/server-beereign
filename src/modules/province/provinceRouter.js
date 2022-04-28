const { Router } = require('express');

const ProvinceService = require('./provinceService');
const validatorHandler = require('../../app/middlewares/validatorHandler');
const {
  getProvinceSchema,
  createProvinceSchema,
  updateProvinceSchema,
  queryProvinceSchema,
} = require('./provinceDto');

const router = Router();
const provinceService = new ProvinceService();

router.get('/',
validatorHandler(queryProvinceSchema, 'query'),
async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const provinces = await provinceService.findAll(limit, offset);
    res.status(200).json(provinces);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getProvinceSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const province = await provinceService.findById(id);
      res.status(200).json(province);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createProvinceSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;
      const province = await provinceService.create(data);
      res.status(200).json(province);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getProvinceSchema, 'params'),
  validatorHandler(updateProvinceSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const province = await provinceService.findById(id);
      await province.update(data);
      res.status(200).json(province);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
