const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { Employee } = require('../employee/employee');
const {
  TypeOfEmployeeModule,
} = require('../typeOfEmployeeModule/typeOfEmployeeModule');

const TYPE_OF_EMPLOYEE_PROPERTIES = {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
};

class TypeOfEmployee extends Model {}

TypeOfEmployee.init(TYPE_OF_EMPLOYEE_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.typeOfEmployee.modelName,
  tableName: models.typeOfEmployee.tableName,
});

TypeOfEmployee.hasMany(Employee, {
  foreignKey: 'typeOfEmployeeId',
  sourceKey: 'id',
});
Employee.belongsTo(TypeOfEmployee, {
  foreignKey: 'typeOfEmployeeId',
  sourceKey: 'id',
});

TypeOfEmployee.hasMany(TypeOfEmployeeModule, {
  foreignKey: 'typeOfEmployeeId',
  sourceKey: 'id',
});
TypeOfEmployeeModule.belongsTo(TypeOfEmployee, {
  foreignKey: 'typeOfEmployeeId',
  sourceKey: 'id',
});

module.exports = {
  TypeOfEmployee,
  TYPE_OF_EMPLOYEE_PROPERTIES,
};
