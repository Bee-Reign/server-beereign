const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { COUNTRY_TABLE } = require('../country/country');
const { PROVINCE_TABLE } = require('../province/province');

const WAREHOUSE_TABLE = 'warehouses';
const WAREHOUSE_PROPERTIES = {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  countryId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'country_id',
    references: {
      model: COUNTRY_TABLE,
      key: 'id',
    },
  },
  provinceId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'province_id',
    references: {
      model: PROVINCE_TABLE,
      key: 'id',
    },
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY,
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
  modelName: 'Warehouse',
  tableName: WAREHOUSE_TABLE,
});

module.exports = {
  Warehouse,
  WAREHOUSE_TABLE,
  WAREHOUSE_PROPERTIES,
};
