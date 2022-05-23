const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { RawMaterialBatch } = require('../rawMaterialBatch/rawMaterialBatch');
const { ProductBatch } = require('../productBatch/productBatch');

const WAREHOUSE_PROPERTIES = {
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
  countryId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'country_id',
    references: {
      model: models.country.tableName,
      key: 'id',
    },
  },
  provinceId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'province_id',
    references: {
      model: models.province.tableName,
      key: 'id',
    },
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

class Warehouse extends Model {}

Warehouse.init(WAREHOUSE_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.warehouse.modelName,
  tableName: models.warehouse.tableName,
});

Warehouse.hasMany(RawMaterialBatch, {
  foreignKey: 'warehouseId',
  sourceKey: 'id',
});
RawMaterialBatch.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  sourceKey: 'id',
});

Warehouse.hasMany(ProductBatch, {
  foreignKey: 'warehouseId',
  sourceKey: 'id',
});
ProductBatch.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  sourceKey: 'id',
});

module.exports = {
  Warehouse,
  WAREHOUSE_PROPERTIES,
};
