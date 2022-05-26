const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { Product } = require('../product/product');
const { Warehouse } = require('../warehouse/warehouse');
const { ProductBatch } = require('./productBatch');
const { Employee } = require('../employee/employee');
const { RawMaterialBatchService } = require('../rawMaterialBatch');

const rawMaterialBatchService = new RawMaterialBatchService();

class ProductBatchService {
  constructor() {}

  async findAll(limit = 15, offset = 0, order = 'ASC', type = 'inStock') {
    switch (type) {
      case 'inStock':
        const inStock = await ProductBatch.findAndCountAll({
          attributes: [
            'id',
            'entryDate',
            'expirationDate',
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
        return inStock;
      case 'empty':
        const emptyStock = await ProductBatch.findAndCountAll({
          attributes: [
            'id',
            'entryDate',
            'expirationDate',
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
        return emptyStock;
      case 'all':
        const allStock = await ProductBatch.findAndCountAll({
          attributes: [
            'id',
            'entryDate',
            'expirationDate',
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
        return allStock;
      default:
        throw boom.badRequest();
    }
  }

  async findById(id, isOutput = true) {
    if (isOutput) {
      const toDay = new Date().toISOString().substring(0, 10);
      const productBatch = await ProductBatch.findOne({
        attributes: ['id', 'unitCost', 'stock'],
        where: {
          id,
          stock: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: Product,
            attributes: ['id', 'name'],
          },
        ],
      });
      if (!productBatch) {
        throw boom.notFound('product batch not found');
      }
      return productBatch;
    }
    const productBatch = await ProductBatch.findOne({
      attributes: ['id', 'expirationDate', 'unitCost', 'stock'],
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
    if (!productBatch) {
      throw boom.notFound('product batch not found');
    }
    return productBatch;
  }

  async create(sub, data) {
    data.employeeId = sub;
    data.stock = data.quantity;
    const t = await ProductBatch.sequelize.transaction();
    try {
      const productBatch = await ProductBatch.create(data, { transaction: t });
      await rawMaterialBatchService.updateBatches(data.batches);
      await t.commit();
      return productBatch;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async update(id, data) {
    const productBatch = await this.findById(id);
    await productBatch.update(data);
    return productBatch;
  }
}

module.exports = ProductBatchService;
