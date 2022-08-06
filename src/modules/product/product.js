const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { Packing } = require('../packing/packing');

const PRODUCT_PROPERTIES = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  barcode: {
    type: DataTypes.STRING(128),
    unique: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
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

class Product extends Model {}

Product.init(PRODUCT_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.product.modelName,
  tableName: models.product.tableName,
});

Product.hasMany(Packing, {
  foreignKey: 'productId',
  sourceKey: 'id',
});
Packing.belongsTo(Product, {
  foreignKey: 'productId',
  sourceKey: 'id',
});

module.exports = {
  Product,
  PRODUCT_PROPERTIES,
};
