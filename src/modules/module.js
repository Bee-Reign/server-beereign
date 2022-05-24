const { Model, DataTypes } = require('sequelize');

const sequelize = require('../libs/sequelize');
const { models } = require('../app/config');
const {
  TypeOfEmployeeModule,
} = require('./typeOfEmployeeModule/typeOfEmployeeModule');

const MODULE_PROPERTIES = {
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
  path: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
};

class Module extends Model {}

Module.init(MODULE_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.module.modelName,
  tableName: models.module.tableName,
});

Module.hasMany(TypeOfEmployeeModule, {
  foreignKey: 'moduleId',
  sourceKey: 'id',
});
TypeOfEmployeeModule.belongsTo(Module, {
  foreignKey: 'moduleId',
  sourceKey: 'id',
});

module.exports = {
  Module,
  MODULE_PROPERTIES,
};
