const { DataTypes, Model } = require('sequelize');

const {
  config: { Enum },
} = require('../../app/config/config');
const sequelize = require('../../libs/sequelize');
const { RAW_MATERIAL_TABLE } = require('../rawMaterial/rawMaterial');
const { WAREHOUSE_TABLE } = require('../warehouse/warehouse');

const RAW_MATERIAL_BATCH_TABLE = 'raw_material_batches';
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
      model: RAW_MATERIAL_TABLE,
      key: 'id',
    },
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'warehouse_id',
    references: {
      model: WAREHOUSE_TABLE,
      key: 'id',
    },
  },
  entryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'entry_date',
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    field: 'expiration_date',
  },
  measurement: {
    type: sequelize.ENUM(Enum.spanish),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(12, 4),
    allowNull: false,
  },
  unitCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'unit_cost',
  },
  stock: {
    type: DataTypes.DECIMAL(12, 4),
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
    defaultValue: sequelize.literal('NOW()'),
  },
};

class RawMaterialBatch extends Model {}

RawMaterialBatch.init(RAW_MATERIAL_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: 'RawMaterialBatch',
  tableName: RAW_MATERIAL_TABLE,
});

module.exports = {
  RawMaterialBatch,
  RAW_MATERIAL_TABLE,
  RAW_MATERIAL_PROPERTIES,
};
