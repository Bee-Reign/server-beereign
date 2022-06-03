const { Model, DataTypes } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { RawMaterialBatch } = require('../rawMaterialBatch/rawMaterialBatch');
const { ProductBatch } = require('../productBatch/productBatch');
const { ProductOutput } = require('../productOutput/productOutput');

const EMPLOYEE_PROPERTIES = {
  id: {
    type: DataTypes.INTEGER,
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
  recoveryToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'recovery_token',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('NOW()'),
    field: 'created_at',
    get() {
      return moment(this.dataValues.createdAt).format('D MM YYYY HH:mm:ss');
    },
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

Employee.hasMany(RawMaterialBatch, {
  foreignKey: 'employeeId',
  sourceKey: 'id',
});
RawMaterialBatch.belongsTo(Employee, {
  foreignKey: 'employeeId',
  sourceKey: 'id',
});

Employee.hasMany(ProductBatch, {
  foreignKey: 'employeeId',
  sourceKey: 'id',
});
ProductBatch.belongsTo(Employee, {
  foreignKey: 'employeeId',
  sourceKey: 'id',
});

Employee.hasMany(ProductOutput, {
  foreignKey: 'employeeId',
  sourceKey: 'id',
});
ProductOutput.belongsTo(Employee, {
  foreignKey: 'employeeId',
  sourceKey: 'id',
});

module.exports = {
  Employee,
  EMPLOYEE_PROPERTIES,
};
