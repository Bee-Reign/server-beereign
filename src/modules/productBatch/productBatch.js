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
    autoIncrement: true,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
    references: {
      model: models.product.tableName,
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
    type: DataTypes.INTEGER,
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
