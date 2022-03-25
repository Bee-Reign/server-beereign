const { Router } = require('express');
const router = Router();

//Import modules
const { typeOfEmployeeRouter } = require('../../modules/typeOfEmployee');
const { employeeRouter } = require('../../modules/employee');

router.get('', function (req, res) {
  res.status(200).json({
    message: 'the bee is born',
  });
});

//System routes
router.use('/v1/types-of-employee', typeOfEmployeeRouter);
router.use('/v1/employees', employeeRouter);

router.all('*', function (req, res) {
  res.status(404).json({
    message: 'not found',
  });
});

module.exports = router;
