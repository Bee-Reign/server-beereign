const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
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
      return moment(this.dataValues.entryDate).format('D MM YYYY');
    },
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    field: 'expiration_date',
    get() {
      return this.dataValues.expirationDate !== null
        ? moment(this.dataValues.expirationDate).format('D MM YYYY')
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
    type: DataTypes.BIGINT,
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
};

class ProductBatch extends Model {}

ProductBatch.init(PRODUCT_BATCH_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.productBatch.modelName,
  tableName: models.productBatch.tableName,
});

module.exports = {
  ProductBatch,
  PRODUCT_BATCH_PROPERTIES,
};
