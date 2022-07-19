const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const {
  ProductOutputDetail,
} = require('../productOutputDetail/model/entity/productOutputDetail');

const PRODUCT_BATCH_PROPERTIES = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

class ProductBatch extends Model {}

ProductBatch.init(PRODUCT_BATCH_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.productBatch.modelName,
  tableName: models.productBatch.tableName,
});

ProductBatch.hasMany(ProductOutputDetail, {
  foreignKey: 'productBatchId',
  sourceKey: 'id',
});
ProductOutputDetail.belongsTo(ProductBatch, {
  foreignKey: 'productBatchId',
  sourceKey: 'id',
});

module.exports = {
  ProductBatch,
  PRODUCT_BATCH_PROPERTIES,
};
