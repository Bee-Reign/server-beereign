const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sendEmail = require('../../libs/nodemailer');
const recoveryTemplate = require('./recoveryTemplate');

const {
  config: { Server },
} = require('../../app/config');
const { EmployeeService } = require('../employee');
const { TypeOfEmployeeModuleService } = require('../typeOfEmployeeModule');

const employeeService = new EmployeeService();
const typeOfEmployeeModuleService = new TypeOfEmployeeModuleService();

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

  async recoveryPassword(email) {
    const employee = await employeeService.findByEmail(email);
    if (!employee) {
      return null;
    }
    const subject = 'Password Recovery';
    const name = `${employee.name} ${employee.lastName}`;
    const payload = {
      sub: employee.id,
    };
    const token = jwt.sign(payload, Server.recoverySecret, {
      expiresIn: '15min',
    });
    await employeeService.update(employee.id, 'recovery', {
      recoveryToken: token,
    });
    const url = `${Server.frontEndUrl}/?token=${token}`;
    const result = await sendEmail(
      email,
      subject,
      '',
      recoveryTemplate(name, url)
    );
    return result;
  }

  async resetPassword(token, password) {
    try {
      const payload = jwt.verify(token, Server.recoverySecret);
      const employee = await employeeService.findById(payload.sub);
      if (employee.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const result = await employeeService.updatePassword(
        payload.sub,
        password
      );
      return result;
    } catch (err) {
      throw boom.unauthorized();
    }
  }

  async getEmployeeProfile(id) {
    const employee = await employeeService.findById(id);
    const modules =
      await typeOfEmployeeModuleService.findAllModulesByEmployeeId(
        employee.dataValues.typeOfEmployee.id
      );
    employee.dataValues.modules = modules;
    return employee;
  }
}

module.exports = AuthService;
