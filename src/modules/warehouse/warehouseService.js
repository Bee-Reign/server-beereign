const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { Warehouse } = require('./warehouse');
const { Country } = require('../country/country');
const { Province } = require('../province/province');

class WarehouseService {
  constructor() {}

  async warehouseNameExist(name = '') {
    const ifExist = await Warehouse.findOne({
      where: {
        name: name,
      },
    });
    if (ifExist) {
      throw boom.conflict('warehouse name already exist');
    }
  }

  async findAll(limit = null, offset = null, filter = '') {
    if (limit === null || offset === null) {
      const warehouses = await Warehouse.findAll({
        attributes: ['id', 'name', 'city'],
        order: [['id', 'ASC']],
        where: {
          deleted: false,
          name: {
            [Op.like]: '%' + filter + '%',
          },
        },
        limit: 25,
      });
      return warehouses;
    }
    const warehouses = await Warehouse.findAndCountAll({
      attributes: ['id', 'name', 'city'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
        name: {
          [Op.like]: '%' + filter + '%',
        },
      },
      include: [
        {
          model: Country,
          attributes: ['id', 'name'],
        },
        {
          model: Province,
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
    });
    return warehouses;
  }

  async findById(id) {
    const warehouse = await Warehouse.findOne({
      attributes: ['id', 'name', 'city'],
      where: {
        id: id,
        deleted: false,
      },
      include: [
        {
          model: Country,
          attributes: ['id', 'name'],
        },
        {
          model: Province,
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!warehouse) {
      throw boom.notFound('warehouse not found');
    }
    return warehouse;
  }

  async create(data) {
    await this.warehouseNameExist(data.name);
    const warehouse = await Warehouse.create(data);
    delete warehouse.dataValues.deleted;
    return warehouse;
  }

  async update(id, data) {
    const warehouse = await this.findById(id);
    if (warehouse.name != data.name) {
      await this.warehouseNameExist(data.name);
    }
    await warehouse.update(data);
    delete warehouse.dataValues.deleted;
    return warehouse;
  }

  async disable(id) {
    const warehouse = await this.findById(id);
    await warehouse.update({
      deleted: true,
    });
  }
}

module.exports = WarehouseService;
