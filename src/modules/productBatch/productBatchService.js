const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');
const QueryTypes = require('sequelize/lib/query-types');

const { Product } = require('../product/product');
const { Warehouse } = require('../warehouse/warehouse');
const { ProductBatch } = require('./productBatch');
const { Employee } = require('../employee/employee');
const { Packing } = require('../packing/packing');

class ProductBatchService {
  SELECT_ALL_BATCHES_BY_PRODUCT_ID =
    'SELECT productBatch.id from product_batches productBatch INNER JOIN packings packing on packing.id = productBatch.id \
  INNER JOIN products product on packing.product_id = product.id \
  WHERE product.id = :id;';
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
            attributes: { exclude: ['deleted'] },
            where: {
              deleted: false,
              stock: {
                [Op.gt]: 0,
              },
            },
            include: [
              {
                model: Packing,
                order: [['entryDate', order]],
                attributes: {
                  exclude: ['productId', 'warehouseId', 'employeeId'],
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
              },
            ],
            limit,
            offset,
          });
          return inStock;
        }
        const inStock = await ProductBatch.findAndCountAll({
          attributes: { exclude: ['deleted'] },
          where: {
            deleted: false,
            stock: {
              [Op.gt]: 0,
            },
          },
          include: [
            {
              model: Packing,
              order: [['entryDate', order]],
              attributes: {
                exclude: ['productId', 'warehouseId', 'employeeId'],
              },
              where: {
                productId,
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
            },
          ],
          limit,
          offset,
        });
        return inStock;
      case 'empty':
        if (productId === null) {
          const emptyStock = await ProductBatch.findAndCountAll({
            attributes: { exclude: ['deleted'] },
            where: {
              deleted: false,
              stock: {
                [Op.lte]: 0,
              },
            },
            include: [
              {
                model: Packing,
                order: [['entryDate', order]],
                attributes: {
                  exclude: ['productId', 'warehouseId', 'employeeId'],
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
              },
            ],
            limit,
            offset,
          });
          return emptyStock;
        }
        const emptyStock = await ProductBatch.findAndCountAll({
          attributes: { exclude: ['deleted'] },
          where: {
            deleted: false,
            stock: {
              [Op.lte]: 0,
            },
          },
          include: [
            {
              model: Packing,
              order: [['entryDate', order]],
              attributes: {
                exclude: ['productId', 'warehouseId', 'employeeId'],
              },
              where: {
                productId,
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
        deleted: false,
        stock: {
          [Op.gt]: 0,
        },
      },
      include: [
        {
          model: Packing,
          order: [['entryDate', 'ASC']],
          attributes: {
            exclude: ['productId', 'warehouseId', 'employeeId'],
          },
          where: {
            productId: id,
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
        },
      ],
    });
    return productBatches;
  }

  async checkIfBatchesExistByProductId(productId) {
    const batches = await ProductBatch.sequelize.query(
      this.SELECT_ALL_BATCHES_BY_PRODUCT_ID,
      {
        replacements: { id: productId },
        type: QueryTypes.SELECT,
      }
    );
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
            model: Packing,
            attributes: {
              exclude: ['productId', 'warehouseId', 'employeeId'],
            },
            include: [
              {
                model: Product,
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      });
      if (!productBatch) {
        throw boom.notFound('product batch not found');
      }
      return productBatch;
    }
    const productBatch = await ProductBatch.findOne({
      where: {
        id,
        deleted: false,
      },
    });
    if (!productBatch) {
      throw boom.notFound('product batch not found');
    }
    return productBatch;
  }

  async create(data, transaction) {
    const productBatch = await ProductBatch.create(data, {
      transaction: transaction,
    });
    return productBatch;
  }

  async update(id, data) {
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
