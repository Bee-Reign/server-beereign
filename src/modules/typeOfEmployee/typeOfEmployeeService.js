const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { TypeOfEmployee } = require('./typeOfEmployee');

class TypeOfEmployeeService {
  constructor() {
    //
  }

  async typeNameExist(name = '') {
    const ifExist = await TypeOfEmployee.findOne({
      where: {
        name,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll(limit = null, offset = null, filter = '') {
    if (limit === null || offset === null) {
      const typesOfEmployee = await TypeOfEmployee.findAll({
        attributes: ['id', 'name'],
        order: [['id', 'ASC']],
        where: {
          deleted: false,
          name: {
            [Op.like]: '%' + filter + '%',
          },
        },
        limit: 25,
      });
      return typesOfEmployee;
    }
    const typesOfEmployee = await TypeOfEmployee.findAndCountAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
        name: {
          [Op.like]: '%' + filter + '%',
        },
      },
      limit: limit,
      offset: offset,
    });
    return typesOfEmployee;
  }

  async findById(id) {
    const typeOfEmployee = await TypeOfEmployee.findOne({
      attributes: ['id', 'name', 'description'],
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!typeOfEmployee) {
      throw boom.notFound('type of employee not found');
    }
    return typeOfEmployee;
  }

  async create(data) {
    await this.typeNameExist(data.name);
    const typeOfEmployee = await TypeOfEmployee.create(data);
    return typeOfEmployee;
  }

  async update(id, data) {
    const typeOfEmployee = await this.findById(id);
    await typeOfEmployee.update(data);
    return typeOfEmployee;
  }

  async disable(id) {
    const typeOfEmployee = await this.findById(id);
    await typeOfEmployee.update({
      deleted: true,
    });
  }
}

module.exports = TypeOfEmployeeService;
