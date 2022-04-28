const { Router } = require('express');

const CountryService = require('./countryService');
const validatorHandler = require('../../app/middlewares/validatorHandler');
const {
  getCountrySchema,
  createCountrySchema,
  updateCountrySchema,
} = require('./countryDto');

const router = Router();
const countryService = new CountryService();

router.get('/', async (req, res, next) => {
  try {
    const countries = await countryService.findAll();
    res.status(200).json(countries);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  validatorHandler(createCountrySchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;
      const country = await countryService.create(data);
      res.status(201).json(country);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/',
  validatorHandler(getCountrySchema, 'params'),
  validatorHandler(createCountrySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const country = await countryService.create(id, data);
      res.status(200).json(country);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
