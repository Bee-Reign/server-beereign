const boom = require('@hapi/boom');

const { Product } = require('../product/product');
const { Warehouse } = require('../warehouse/warehouse');
const { Packing } = require('./packing');
const { Employee } = require('../employee/employee');
const { RawMaterialBatchService } = require('../rawMaterialBatch');
const { PackingDetailService } = require('../packingDetail');
const { ProductBatchService } = require('../productBatch');

const rawMaterialBatchService = new RawMaterialBatchService();
const packingDetailService = new PackingDetailService();
const productBatchService = new ProductBatchService();

class PackingService {
  constructor() {}

  async findAll(limit = 15, offset = 0, order = 'DESC', type = 'suspended') {
    const isDone = type === 'suspended' ? false : true;
    const packings = Packing.findAndCountAll({
      attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
      order: [['entryDate', order]],
      where: {
        isDone,
      },
      include: [
        {
          model: Employee,
          attributes: ['id', 'name', 'lastName'],
        },
        {
          model: Product,
          attributes: ['id', 'name'],
        },
        {
          model: Warehouse,
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
    });
    return packings;
  }

  async findById(id) {
    const packing = await Packing.findOne({
      attributes: {
        exclude: ['productId', 'warehouseId', 'employeeId'],
      },
      where: {
        id,
      },
      include: [
        {
          model: Product,
          attributes: ['id', 'name'],
        },
        {
          model: Warehouse,
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!packing) {
      throw boom.notFound('packing not found');
    }
    const batches = await packingDetailService.findAllByPackingId(id);
    packing.dataValues.batches = batches;
    return packing;
  }

  async create(sub, data) {
    data.employeeId = sub;
    data.isDone = true;
    const t = await Packing.sequelize.transaction();
    try {
      const packing = await Packing.create(data, { transaction: t });
      await packingDetailService.createAll(
        data.batches,
        packing.dataValues.id,
        t
      );
      await productBatchService.create(
        {
          id: packing.dataValues.id,
          unitCost: data.unitCost,
          stock: data.quantity,
        },
        t
      );
      await rawMaterialBatchService.updateBatches(data.batches);
      await t.commit();
      return packing;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async createBatch(sub, data) {
    data.employeeId = sub;
    data.isDone = true;
    const t = await Packing.sequelize.transaction();
    try {
      const packing = await Packing.create(data, { transaction: t });
      await productBatchService.create(
        {
          id: packing.dataValues.id,
          unitCost: data.unitCost,
          stock: data.quantity,
        },
        t
      );
      await t.commit();
      return packing;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async suspend(sub, data) {
    data.employeeId = sub;
    data.isDone = false;
    const t = await Packing.sequelize.transaction();
    try {
      const packing = await Packing.create(data, { transaction: t });
      await packingDetailService.createAll(
        data.batches,
        packing.dataValues.id,
        t
      );
      await t.commit();
      return packing;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async update(id, sub, data) {
    data.employeeId = sub;
    const packing = await Packing.findOne({
      where: {
        id,
      },
    });
    if (!packing || packing.isDone === true) {
      throw boom.notFound('packing not found');
    }
    const t = await Packing.sequelize.transaction();
    try {
      await packing.update(data, { transaction: t });
      await packingDetailService.deleteAllByPackingId(id, t);
      await packingDetailService.createAll(data.batches, id, t);
      if (data.isDone === true) {
        await productBatchService.create(
          {
            id: id,
            unitCost: data.unitCost,
            stock: data.quantity,
          },
          t
        );
        await rawMaterialBatchService.updateBatches(data.batches);
      }
      await t.commit();
      return packing;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async updateBatch(id, data) {
    const packing = await Packing.findOne({
      where: {
        id,
      },
    });
    const t = await Packing.sequelize.transaction();
    try {
      packing.update(data, { transaction: t });
      await productBatchService.update(id, data);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}

module.exports = PackingService;
