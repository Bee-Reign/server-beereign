const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const {
  config: { Enum },
} = require('../../app/config/config');
const RAW_MATERIAL_PROPERTIES = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  rawMaterialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'raw_material_id',
    references: {
      model: models.rawMaterial.tableName,
      key: 'id',
    },
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'warehouse_id',
    references: {
      model: models.warehouse.tableName,
      key: 'id',
    },
  },
  entryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'entry_date',
    get() {
      return moment(this.dataValues.entryDate).format('D MM YYYY');
    },
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    field: 'expiration_date',
    get() {
      return this.dataValues.expirationDate !== null
        ? moment(this.dataValues.expirationDate).format('D MM YYYY')
        : 'does not expire';
    },
  },
  measurement: {
    type: DataTypes.ENUM(Enum.spanish),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  unitCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'unit_cost',
  },
  totalCost: {
    type: DataTypes.DECIMAL(15, 2),
    field: 'cost_value',
  },
  stock: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  employeeId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'employee_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    get() {
      return moment(this.dataValues.createdAt).format('D MM YYYY HH:mm:ss');
    },
    defaultValue: sequelize.literal('NOW()'),
  },
};

class RawMaterialBatch extends Model {}

RawMaterialBatch.init(RAW_MATERIAL_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.rawMaterialBatch.modelName,
  tableName: models.rawMaterialBatch.tableName,
});

module.exports = {
  RawMaterialBatch,
  RAW_MATERIAL_PROPERTIES,
};
