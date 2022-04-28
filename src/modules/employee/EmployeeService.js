const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { Employee } = require('./employee');
const { TypeOfEmployeeService } = require('../typeOfEmployee');

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

  async findAll() {
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
      },
    });
    return employees;
  }

  async findById(id) {
    const employee = await Employee.findOne({
      attributes: [
        'id',
        'name',
        'lastName',
        'cellPhone',
        'email',
        'typeOfEmployeeId',
        'createdAt',
      ],
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!employee) {
      throw boom.notFound('employee not found');
    }
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
    return employee;
  }

  async update(id, data) {
    const employee = await this.findById(id);
    await employee.update(data);
    return employee;
  }

  async updateLogin(id, email, password) {
    const employee = await this.findById(id);
    const salt = bcrypt.genSalt(10);
    password = bcrypt.hashSync(salt);
    await employee.update({
      email,
      password,
    });
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
