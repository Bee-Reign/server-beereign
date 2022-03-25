const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../libs/sequelize');

const TYPE_OF_EMPLOYEE_TABLE = 'types_of_employee';

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
  modelName: 'TypeOfEmployee',
  tableName: TYPE_OF_EMPLOYEE_TABLE,
});

module.exports = {
  TypeOfEmployee,
  TYPE_OF_EMPLOYEE_TABLE,
  TYPE_OF_EMPLOYEE_PROPERTIES,
};
