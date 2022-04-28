const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');

const EMPLOYEE_PROPERTIES = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'last_name',
  },
  cellPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'cell_phone',
  },
  email: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  typeOfEmployeeId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'type_of_employee_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('NOW()'),
    field: 'created_at',
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

class Employee extends Model {}

Employee.init(EMPLOYEE_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.employee.modelName,
  tableName: models.employee.tableName,
});

module.exports = {
  Employee,
  EMPLOYEE_PROPERTIES,
};
