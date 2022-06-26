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

  async findAll(
    limit = 15,
    offset = 0,
    order = 'ASC',
    type = 'inStock',
    productId = null
  ) {
    switch (type) {
      case 'inStock':
        if (productId === null) {
          const inStock = await ProductBatch.findAndCountAll({
            attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
            order: [['entryDate', order]],
            where: {
              deleted: false,
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
        }
        const inStock = await ProductBatch.findAndCountAll({
          attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
          order: [['entryDate', order]],
          where: {
            productId,
            deleted: false,
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
        if (productId === null) {
          const emptyStock = await ProductBatch.findAndCountAll({
            attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
            order: [['entryDate', order]],
            where: {
              deleted: false,
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
        }
        const emptyStock = await ProductBatch.findAndCountAll({
          attributes: { exclude: ['productId', 'warehouseId', 'employeeId'] },
          order: [['entryDate', order]],
          where: {
            productId,
            deleted: false,
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
      default:
        throw boom.badRequest();
    }
  }

  async findAllByProduct(id) {
    const productBatches = await ProductBatch.findAll({
      attributes: ['id', 'unitCost', 'stock'],
      where: {
        productId: id,
        deleted: false,
        stock: {
          [Op.gt]: 0,
        },
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
    return productBatches;
  }

  async checkIfBatchesExistByProductId(productId) {
    const batches = await ProductBatch.findAll({
      where: {
        productId,
        deleted: false,
        stock: {
          [Op.gt]: 0,
        },
      },
    });
    if (batches.length === 0) return false;
    return true;
  }

  async findById(id, isOutput = true) {
    if (isOutput === true) {
      const productBatch = await ProductBatch.findOne({
        attributes: ['id', 'unitCost', 'stock'],
        where: {
          id,
          deleted: false,
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
        deleted: false,
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

  async update(sub, id, data) {
    data.employeeId = sub;
    const productBatch = await this.findById(id, false);
    await productBatch.update(data);
    return productBatch;
  }

  async updateBatches(batches) {
    const t = await ProductBatch.sequelize.transaction();
    let productBatch;
    try {
      for (let i in batches) {
        const {
          totalCost,
          unitCost,
          productId,
          createdAt,
          employeeId,
          ...data
        } = batches[i];
        productBatch = await ProductBatch.findByPk(data.id);
        if (Number(productBatch.stock) < Number(data.quantityUsed))
          throw boom.badRequest('the quantity used is greater than the stock');
        data.stock -= data.quantityUsed;
        await productBatch.update(data, { transaction: t });
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
    return true;
  }

  async disableBatch(id) {
    const productBatch = await this.findById(id, false);
    await productBatch.update({
      deleted: true,
    });
  }
}

module.exports = ProductBatchService;
