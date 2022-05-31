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
          attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
          order: [['entryDate', order]],
          where: {
            isFinished: true,
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
          attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
          order: [['entryDate', order]],
          where: {
            isFinished: true,
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
      case 'inProcess':
        const inProcess = await ProductBatch.findAndCountAll({
          attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
          order: [['entryDate', order]],
          where: {
            isFinished: false,
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
        return inProcess;
      case 'all':
        const allStock = await ProductBatch.findAndCountAll({
          attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
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

  async findAllInProcess(limit = 15, offset = 0) {
    const allInProcess = await ProductBatch.findAndCountAll({
      attributes: {
        exclude: [
          'productId',
          'warehouseId',
          'employeeId',
          'unitCost',
          'stock',
          'totalCost',
        ],
      },
      order: [['entryDate', 'ASC']],
      where: {
        isFinished: false,
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
    return allInProcess;
  }

  async findOneInProcessById(id) {
    const inProcess = await ProductBatch.findOne({
      attributes: {
        exclude: [
          'productId',
          'warehouseId',
          'employeeId',
          'totalCost',
          'stock',
        ],
      },
      where: {
        id,
        isFinished: false,
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
    if (!inProcess) {
      throw boom.notFound('packing in process not found');
    }
    return inProcess;
  }

  async findById(id, isOutput = true) {
    if (isOutput === true) {
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
      attributes: {
        exclude: [
          'productId',
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

  async updateBatchSaved(sub, id, data) {
    data.employeeId = sub;
    data.stock = data.quantity;
    const t = await ProductBatch.sequelize.transaction();
    try {
      const productBatch = await this.findById(id, false);
      await productBatch.update(data, { transaction: t });
      await rawMaterialBatchService.updateBatches(data.batches);
      await t.commit();
      return productBatch;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async update(sub, id, data) {
    data.employeeId = sub;
    const productBatch = await this.findById(id, false);
    await productBatch.update(data);
    return productBatch;
  }
}

module.exports = ProductBatchService;
