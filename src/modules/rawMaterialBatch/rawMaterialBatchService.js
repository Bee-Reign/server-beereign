const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { RawMaterial } = require('../rawMaterial/rawMaterial');
const { Warehouse } = require('../warehouse/warehouse');

const { RawMaterialBatch } = require('./rawMaterialBatch');
const { Employee } = require('../employee/employee');

class RawMaterialBatchService {
  constructor() {}

  async findAll(limit = 15, offset = 0, order = 'ASC', type = 'inStock') {
    switch (type) {
      case 'inStock':
        const inStock = await RawMaterialBatch.findAndCountAll({
          attributes: [
            'id',
            'entryDate',
            'expirationDate',
            'measurement',
            'quantity',
            'unitCost',
            'stock',
          ],
          order: [['entryDate', order]],
          where: {
            stock: {
              [Op.gt]: 0,
            },
          },
          include: [
            {
              model: Employee,
              attributes: ['id', 'name', 'lastName'],
            },
            {
              model: RawMaterial,
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
        return inStock;
      case 'empty':
        const emptyStock = await RawMaterialBatch.findAndCountAll({
          attributes: [
            'id',
            'entryDate',
            'expirationDate',
            'measurement',
            'quantity',
            'unitCost',
            'stock',
          ],
          order: [['entryDate', order]],
          where: {
            stock: {
              [Op.lte]: 0,
            },
          },
          include: [
            {
              model: Employee,
              attributes: ['id', 'name', 'lastName'],
            },
            {
              model: RawMaterial,
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
        return emptyStock;
      case 'all':
        const allStock = await RawMaterialBatch.findAndCountAll({
          attributes: [
            'id',
            'entryDate',
            'expirationDate',
            'measurement',
            'quantity',
            'unitCost',
            'stock',
          ],
          order: [['entryDate', order]],
          include: [
            {
              model: Employee,
              attributes: ['id', 'name', 'lastName'],
            },
            {
              model: RawMaterial,
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
        return allStock;
      default:
        throw boom.badRequest();
    }
  }

  async findById(id, isPacking = true) {
    if (isPacking === true) {
      const toDay = new Date().toISOString().substring(0, 10);
      const rawMaterialBatch = await RawMaterialBatch.findOne({
        attributes: ['id', 'measurement', 'unitCost', 'stock'],
        where: {
          id,
          stock: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: RawMaterial,
            attributes: ['id', 'name'],
          },
        ],
      });
      if (!rawMaterialBatch) {
        throw boom.notFound('raw material batch not found');
      }
      return rawMaterialBatch;
    }
    const rawMaterialBatch = await RawMaterialBatch.findOne({
      attributes: {
        exclude: [
          'rawMaterialId',
          'warehouseId',
          'employeeId',
          'createdAt',
          'totalCost',
        ],
      },
      where: {
        id,
      },
      include: [
        {
          model: RawMaterial,
          attributes: ['id', 'name'],
        },
        {
          model: Warehouse,
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!rawMaterialBatch) {
      throw boom.notFound('raw material batch not found');
    }
    return rawMaterialBatch;
  }

  async create(sub, data) {
    data.employeeId = sub;
    data.stock = data.quantity;
    const rawMaterialBatch = await RawMaterialBatch.create(data);
    return rawMaterialBatch;
  }

  async update(sub, id, data) {
    data.employeeId = sub;
    const rawMaterialBatch = await this.findById(id, false);
    await rawMaterialBatch.update(data);
    return rawMaterialBatch;
  }

  async updateBatches(batches) {
    const t = await RawMaterialBatch.sequelize.transaction();
    let rawMaterialBatch;
    try {
      for (let i in batches) {
        const {
          totalCost,
          unitCost,
          rawMaterialId,
          createdAt,
          employeeId,
          ...data
        } = batches[i];
        rawMaterialBatch = await RawMaterialBatch.findByPk(data.id);
        if (Number(rawMaterialBatch.stock) < Number(data.quantityUsed))
          throw boom.badRequest('the quantity used is greater than the stock');
        data.stock -= data.quantityUsed;
        await rawMaterialBatch.update(data, { transaction: t });
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
    return true;
  }
}

module.exports = RawMaterialBatchService;
