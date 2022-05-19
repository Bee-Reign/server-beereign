const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');
const bcrypt = require('bcrypt');

const { Employee } = require('./employee');
const { TypeOfEmployee } = require('../typeOfEmployee/typeOfEmployee');
const { TypeOfEmployeeService } = require('../typeOfEmployee');
const { updateProfile, updateLogin } = require('./employeeDto');

const typeOfEmployeeService = new TypeOfEmployeeService();

class EmployeeService {
  constructor() {}

  async emailExist(email = '') {
    const ifExist = await Employee.findOne({
      where: {
        email,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll(limit = null, offset = null, filter = '') {
    if (limit === null || offset === null) {
      const employees = await Employee.findAll({
        attributes: [
          'id',
          'name',
          'lastName',
          'cellPhone',
          'email',
          'typeOfEmployeeId',
          'createdAt',
        ],
        order: [['id', 'ASC']],
        where: {
          deleted: false,
          name: {
            [Op.like]: '%' + filter + '%',
          },
        },
        limit: 25,
      });
      return employees;
    }
    const employees = await Employee.findAndCountAll({
      attributes: [
        'id',
        'name',
        'lastName',
        'cellPhone',
        'email',
        'typeOfEmployeeId',
        'createdAt',
      ],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
        name: {
          [Op.like]: '%' + filter + '%',
        },
      },
      limit,
      offset,
      include: [
        {
          model: TypeOfEmployee,
          attributes: ['id', 'name'],
        },
      ],
    });
    return employees;
  }

  async findById(id) {
    const employee = await Employee.findOne({
      attributes: ['id', 'name', 'lastName', 'cellPhone', 'email', 'createdAt'],
      where: {
        id: id,
        deleted: false,
      },
      include: [
        {
          model: TypeOfEmployee,
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!employee) {
      throw boom.notFound('employee not found');
    }
    return employee;
  }

  async findByEmail(email) {
    const employee = await Employee.findOne({
      attributes: ['id', 'name', 'lastName', 'cellPhone', 'email', 'password'],
      where: {
        email,
        deleted: false,
      },
      include: [
        {
          model: TypeOfEmployee,
          attributes: ['id', 'name'],
        },
      ],
    });
    return employee;
  }

  async create(data) {
    await this.emailExist(data.email);
    const typeOfEmployee = await typeOfEmployeeService.findById(
      data.typeOfEmployeeId
    );
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
    const employee = await Employee.create(data);
    delete employee.dataValues.password;
    delete employee.dataValues.deleted;
    return employee;
  }

  async update(id, update, data) {
    const employee = await this.findById(id);
    switch (update) {
      case 'profile':
        const { error } = await updateProfile.validate(data, {
          abortEarly: false,
        });
        if (error) {
          throw boom.badRequest(error);
        }
        await employee.update(data);
        break;
      case 'acces':
        const { error: err } = await updateLogin.validate(data, {
          abortEarly: false,
        });
        if (err) {
          throw boom.badRequest(err);
        }
        if (employee.email != data.email) {
          await this.emailExist(data.email);
        }
        const salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
        await employee.update(data);
        break;
      default:
        throw boom.badRequest('Bad Request');
    }
    delete employee.dataValues.password;
    delete employee.dataValues.typeOfEmployeeId;
    delete employee.dataValues.deleted;
    return employee;
  }

  async resetPassword(email, password) {}

  async updatePassword(code, password) {}

  async disableEmployee(id) {
    const employee = await this.findById(id);
    await employee.update({
      deleted: true,
    });
  }
}

module.exports = EmployeeService;
