const { Router } = require('express');
const router = Router();

//Import modules
const { typeOfEmployeeRouter } = require('../../modules/typeOfEmployee');
const { employeeRouter } = require('../../modules/employee');
const { countryRouter } = require('../../modules/country');
const { provinceRouter } = require('../../modules/province');
const { apiaryRouter } = require('../../modules/apiary');
const { rawMaterialRouter } = require('../../modules/rawMaterial');
const { warehouseRouter } = require('../../modules/warehouse');

router.get('/', function (req, res) {
  res.status(200).json({
    message: 'the bee is born',
  });
});

//System routes
router.use('/v1/types-of-employee', typeOfEmployeeRouter);
router.use('/v1/employees', employeeRouter);
router.use('/v1/countries', countryRouter);
router.use('/v1/provinces', provinceRouter);
router.use('/v1/apiaries', apiaryRouter);
router.use('/v1/raw-materials', rawMaterialRouter);
router.use('/v1/warehouses', warehouseRouter);

router.all('*', function (req, res) {
  res.status(404).json({
    message: 'not found',
  });
});

module.exports = router;
