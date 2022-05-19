const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  config: { Server },
} = require('../../app/config');
const { EmployeeService } = require('../employee');

const employeeService = new EmployeeService();

class AuthService {
  async getEmployee(email, password) {
    const employee = await employeeService.findByEmail(email);
    if (!employee) {
      throw boom.unauthorized();
    }
    const validPassword = await bcrypt.compareSync(password, employee.password);
    if (!validPassword) {
      throw boom.unauthorized();
    }
    delete employee.dataValues.password;
    return employee;
  }

  signToken(employee) {
    const payload = {
      sub: employee.id,
      role: employee.typeOfEmployee.name,
    };
    const token = jwt.sign(payload, Server.jwtSecret, {
      expiresIn: '30d',
    });
    return {
      token,
    };
  }

  async getEmployeeProfile(id){
    const employee = await employeeService.findById(id);
    return employee;
  }
}

module.exports = AuthService;
