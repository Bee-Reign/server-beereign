const { Router } = require('express');

const ModuleService = require('./moduleService');

const router = Router();
const moduleService = new ModuleService();

router.get('/', async (req, res, next) => {
  try {
    const modules = await moduleService.findAll();
    res.status(200).json(modules);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
