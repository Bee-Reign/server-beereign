const { Router } = require('express');
const passport = require('passport');
const router = Router();

//Import modules
const { authRouter } = require('../../modules/auth');
const { typeOfEmployeeRouter } = require('../../modules/typeOfEmployee');
const { employeeRouter } = require('../../modules/employee');
const { countryRouter } = require('../../modules/country');
const { provinceRouter } = require('../../modules/province');
const { apiaryRouter } = require('../../modules/apiary');
const { rawMaterialRouter } = require('../../modules/rawMaterial');
const { warehouseRouter } = require('../../modules/warehouse');
const { rawMaterialBatchRouter } = require('../../modules/rawMaterialBatch');
const { productRouter } = require('../../modules/product');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.status(200).json({
      message: 'the bee is born',
    });
  }
);

//System routes
router.use('/v1/auth', authRouter);
router.use(
  '/v1/types-of-employee',
  passport.authenticate('jwt', { session: false }),
  typeOfEmployeeRouter
);
router.use(
  '/v1/employees',
  passport.authenticate('jwt', { session: false }),
  employeeRouter
);
router.use(
  '/v1/countries',
  passport.authenticate('jwt', { session: false }),
  countryRouter
);
router.use(
  '/v1/provinces',
  passport.authenticate('jwt', { session: false }),
  provinceRouter
);
router.use(
  '/v1/apiaries',
  passport.authenticate('jwt', { session: false }),
  apiaryRouter
);
router.use(
  '/v1/raw-materials',
  passport.authenticate('jwt', { session: false }),
  rawMaterialRouter
);
router.use(
  '/v1/warehouses',
  passport.authenticate('jwt', { session: false }),
  warehouseRouter
);
router.use(
  '/v1/raw-material-batches',
  passport.authenticate('jwt', { session: false }),
  rawMaterialBatchRouter
);
router.use(
  '/v1/products',
  passport.authenticate('jwt', { session: false }),
  productRouter
);

router.all(
  '*',
  passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.status(404).json({
      message: 'not found',
    });
  }
);

module.exports = router;
