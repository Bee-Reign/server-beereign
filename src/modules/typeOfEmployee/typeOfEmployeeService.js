const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { TypeOfEmployee } = require('./typeOfEmployee');
const { TypeOfEmployeeModuleService } = require('../typeOfEmployeeModule');

const typeOfEmployeeModuleService = new TypeOfEmployeeModuleService();
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
      throw boom.conflict('type of employee already exist');
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
      attributes: ['id', 'name', 'description'],
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

  async findAllModulesByTypeOfEmployee(id) {
    const modules =
      await typeOfEmployeeModuleService.findAllModulesByTypeOfEmployee(id);
    return modules;
  }

  async create(data) {
    await this.typeNameExist(data.name);
    try {
      const typeOfEmployee = await TypeOfEmployee.create(data);
      await typeOfEmployeeModuleService.insertModulesFromTypeOfEmployee(
        data.modules,
        typeOfEmployee.id
      );
      delete typeOfEmployee.dataValues.deleted;
      return typeOfEmployee;
    } catch (err) {
      throw err;
    }
  }

  async update(id, data) {
    if (id == 1) throw boom.conflict('admin cannot be changed');
    const typeOfEmployee = await this.findById(id);
    if (typeOfEmployee.name != data.name) {
      await this.typeNameExist(data.name);
    }
    await typeOfEmployee.update(data);
    await typeOfEmployeeModuleService.updateModulesFromTypeOfEmployee(
      data.modules,
      typeOfEmployee.id
    );
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
