const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');

const PACKING_DETAIL_PROPERTIES = {
  packingId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'packing_id',
    references: {
      model: models.packing.tableName,
      key: 'id',
    },
    primaryKey: true,
  },
  rawMaterialBatchId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'raw_material_batch_id',
    references: {
      model: models.rawMaterialBatch.tableName,
      key: 'id',
    },
    primaryKey: true,
  },
  quantityUsed: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'quantity_used',
  },
};

class PackingDetail extends Model {}

PackingDetail.init(PACKING_DETAIL_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.packingDetail.modelName,
  tableName: models.packingDetail.tableName,
});

module.exports = {
  PackingDetail,
  PACKING_DETAIL_PROPERTIES,
};
