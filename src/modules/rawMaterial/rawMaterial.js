const { DataTypes, Model } = require('sequelize');

const sequelize = require('../..//libs/sequelize');

const RAW_MATERIAL_TABLE = 'raw_materials';
const RAW_MATERIAL_PROPERTIES = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(12),
    unique: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    defaultValue: sequelize.literal('NOW()'),
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

class RawMaterial extends Model {}

RawMaterial.init(RAW_MATERIAL_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: 'RawMaterial',
  tableName: RAW_MATERIAL_TABLE,
});

module.exports = {
  RawMaterial,
  RAW_MATERIAL_TABLE,
  RAW_MATERIAL_PROPERTIES,
};
