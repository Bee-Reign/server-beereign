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

  async findById(id, type = 'packing') {
    const rawMaterialBatch = await RawMaterialBatch.findOne({
      attributes: ['id', 'expirationDate', 'measurement', 'unitCost', 'stock'],
      where: {
        id,
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

  async create(sub, data) {
    data.employeeId = sub;
    data.stock = data.quantity;
    data.totalCost = data.unitCost * data.quantity;
    const rawMaterialBatch = await RawMaterialBatch.create(data);
    return rawMaterialBatch;
  }

  async update(id, data) {
    const rawMaterialBatch = await this.findById(id);
    await rawMaterialBatch.update(data);
    return rawMaterialBatch;
  }
}

module.exports = RawMaterialBatchService;
