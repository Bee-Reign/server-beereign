const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');

const TYPE_OF_EMPLOYEE_MODULE_PROPERTIES = {
  typeOfEmployeeId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'type_of_employee_id',
    references: {
      model: models.typeOfEmployee.tableName,
      key: 'id',
    },
    primaryKey: true,
  },
  moduleId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'module_id',
    references: {
      model: models.module.tableName,
      key: 'id',
    },
    primaryKey: true,
  },
};

class TypeOfEmployeeModule extends Model {}

TypeOfEmployeeModule.init(TYPE_OF_EMPLOYEE_MODULE_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.typeOfEmployeeModule.modelName,
  tableName: models.typeOfEmployeeModule.tableName,
});

module.exports = {
  TypeOfEmployeeModule,
  TYPE_OF_EMPLOYEE_MODULE_PROPERTIES,
};
