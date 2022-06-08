const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { RawMaterialBatch } = require('../rawMaterialBatch/model/entity/rawMaterialBatch');

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
    get() {
      return moment(this.dataValues.createdAt).format('D MM YYYY HH:mm:ss');
    },
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
  modelName: models.rawMaterial.modelName,
  tableName: models.rawMaterial.tableName,
});

RawMaterial.hasMany(RawMaterialBatch, {
  foreignKey: 'rawMaterialId',
  sourceKey: 'id',
});
RawMaterialBatch.belongsTo(RawMaterial, {
  foreignKey: 'rawMaterialId',
  sourceKey: 'id',
});

module.exports = {
  RawMaterial,
  RAW_MATERIAL_PROPERTIES,
};
