const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../../../libs/sequelize');
const { models } = require('../../../../app/config');
const { PackingDetail } = require('../../../packingDetail/packingDetail');

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
      return moment(this.dataValues.entryDate).format('YYYY-MM-DD');
    },
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    field: 'expiration_date',
    get() {
      return this.dataValues.expirationDate !== null
        ? moment(this.dataValues.expirationDate).format('YYYY-MM-DD')
        : 'does not expire';
    },
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
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employee_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    get() {
      return moment(this.dataValues.createdAt).format('DD MM YYYY HH:mm');
    },
    defaultValue: sequelize.literal('NOW()'),
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

class RawMaterialBatch extends Model {}

RawMaterialBatch.init(RAW_MATERIAL_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.rawMaterialBatch.modelName,
  tableName: models.rawMaterialBatch.tableName,
});

RawMaterialBatch.hasMany(PackingDetail, {
  foreignKey: 'rawMaterialBatchId',
  sourceKey: 'id',
});
PackingDetail.belongsTo(RawMaterialBatch, {
  foreignKey: 'rawMaterialBatchId',
  sourceKey: 'id',
});

module.exports = {
  RawMaterialBatch,
  RAW_MATERIAL_PROPERTIES,
};
