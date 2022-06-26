const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { RawMaterial } = require('../../rawMaterial/model/entity/rawMaterial');
const { Warehouse } = require('../../warehouse/warehouse');

const { RawMaterialBatch } = require('../model/entity/rawMaterialBatch');
const { Employee } = require('../../employee/employee');

class RawMaterialBatchService {
  constructor() {}

  async findAll(
    limit = 15,
    offset = 0,
    order = 'ASC',
    type = 'inStock',
    rawMaterialId = null
  ) {
    switch (type) {
      case 'inStock':
        if (rawMaterialId === null) {
          const inStock = await RawMaterialBatch.findAndCountAll({
            attributes: {
              exclude: ['rawMaterialId', 'warehouseId', 'employeeId'],
            },
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
                model: RawMaterial,
                attributes: ['id', 'name', 'measurement'],
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
        const inStock = await RawMaterialBatch.findAndCountAll({
          attributes: {
            exclude: ['rawMaterialId', 'warehouseId', 'employeeId'],
          },
          order: [['entryDate', order]],
          where: {
            rawMaterialId,
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
              model: RawMaterial,
              attributes: ['id', 'name', 'measurement'],
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
        if (rawMaterialId === null) {
          const emptyStock = await RawMaterialBatch.findAndCountAll({
            attributes: {
              exclude: ['rawMaterialId', 'warehouseId', 'employeeId'],
            },
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
                model: RawMaterial,
                attributes: ['id', 'name', 'measurement'],
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
        const emptyStock = await RawMaterialBatch.findAndCountAll({
          attributes: {
            exclude: ['rawMaterialId', 'warehouseId', 'employeeId'],
          },
          order: [['entryDate', order]],
          where: {
            rawMaterialId,
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
              model: RawMaterial,
              attributes: ['id', 'name', 'measurement'],
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

  async checkIfBatchesExistByRawMaterialId(rawMaterialId) {
    const batches = await RawMaterialBatch.findAll({
      where: {
        rawMaterialId,
        deleted: false,
        stock: {
          [Op.gt]: 0,
        },
      },
    });
    if (batches.length === 0) return false;
    return true;
  }

  async findById(id, isPacking = true) {
    if (isPacking === true) {
      const rawMaterialBatch = await RawMaterialBatch.findOne({
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
            model: RawMaterial,
            attributes: ['id', 'name', 'measurement'],
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
        deleted: false,
      },
      include: [
        {
          model: RawMaterial,
          attributes: ['id', 'name', 'measurement'],
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

  async disableBatch(id) {
    const rawMaterialBatch = await this.findById(id, false);
    await rawMaterialBatch.update({
      deleted: true,
    });
  }
}

module.exports = RawMaterialBatchService;
