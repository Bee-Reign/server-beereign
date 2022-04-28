const boom = require('@hapi/boom');

const { Warehouse } = require('./warehouse');

class WarehouseService {
  constructor() {}

  async WarehouseNameExist(name = '') {
    const ifExist = await Warehouse.findOne({
      where: {
        name: name,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll() {
    const warehouses = await Warehouse.findAll({
      attributes: ['id', 'name', 'countryId', 'provinceId', 'city', 'location'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
      },
    });
    return warehouses;
  }

  async findById(id) {
    const warehouse = await Warehouse.findOne({
      attributes: ['id', 'name', 'countryId', 'provinceId', 'city', 'location'],
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!warehouse) {
      throw boom.notFound('warehouse not found');
    }
    return warehouse;
  }

  async create(data) {
    await this.WarehouseNameExist(data.name);
    const warehouse = await Warehouse.create(data);
    return warehouse;
  }
}

module.exports = WarehouseService;
