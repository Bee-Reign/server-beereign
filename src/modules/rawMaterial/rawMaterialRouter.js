const { Router } = require('express');

const RawMaterialService = require('./rawMaterialService');
const validatorHandler = require('../../app/middlewares/validatorHandler');
const {
  getRawMaterialSchema,
  createRawMaterialSchema,
  updateRawMaterialSchema,
} = require('./rawMaterialDto');

const router = Router();
const rawMaterialService = new RawMaterialService();

router.get('/', async (req, res, next) => {
  try {
    const rawMaterials = await rawMaterialService.findAll();
    res.status(200).json(rawMaterials);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getRawMaterialSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rawMaterial = await rawMaterialService.findById(id);
      res.status(200).json(rawMaterial);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createRawMaterialSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;
      const rawMaterial = await rawMaterialService.create(data);
      res.status(201).json({
        id: rawMaterial.id,
        code: rawMaterial.code,
        name: rawMaterial.name,
        createdAt: rawMaterial.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getRawMaterialSchema, 'params'),
  validatorHandler(updateRawMaterialSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const rawMaterial = await rawMaterialService.update(id, data);
      res.status(201).json({
        id: rawMaterial.id,
        code: rawMaterial.code,
        name: rawMaterial.name,
        createdAt: rawMaterial.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getRawMaterialSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await rawMaterialService.disable(id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
