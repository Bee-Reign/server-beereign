const boom = require('@hapi/boom');

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

  async findAll() {
    const typesOfEmployee = await TypeOfEmployee.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
      },
    });
    return typesOfEmployee;
  }

  async findAllName() {
    const typesOfEmployee = await TypeOfEmployee.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
      },
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
