const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');

const PRODUCT_OUTPUT_DETAIL = {
  productOutputId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'product_output_id',
    primaryKey: true,
  },
  productBatchId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'product_batch_id',
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
};

class ProductOutputDetail extends Model {}

ProductOutputDetail.init(PRODUCT_OUTPUT_DETAIL, {
  sequelize,
  timestamps: false,
  modelName: models.productOutputDetail.modelName,
  tableName: models.productOutputDetail.tableName,
});

module.exports = {
  PRODUCT_OUTPUT_DETAIL,
  ProductOutputDetail,
};
