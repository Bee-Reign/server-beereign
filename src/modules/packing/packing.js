const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { PackingDetail } = require('../packingDetail/packingDetail');
const { ProductBatch } = require('../productBatch/productBatch');

const PACKING_PROPERTIES = {
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
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employee_id',
  },
  isDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_done',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    get() {
      return moment(this.dataValues.createdAt).format('DD MM YYYY HH:mm');
    },
    defaultValue: sequelize.literal('NOW()'),
  },
};

class Packing extends Model {}

Packing.init(PACKING_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.packing.modelName,
  tableName: models.packing.tableName,
});

Packing.hasMany(PackingDetail, {
  foreignKey: 'packingId',
  sourceKey: 'id',
});
PackingDetail.belongsTo(Packing, {
  foreignKey: 'packingId',
  sourceKey: 'id',
});

Packing.hasOne(ProductBatch, {
  foreignKey: 'id',
  sourceKey: 'id',
});
ProductBatch.belongsTo(Packing, {
  foreignKey: 'id',
  sourceKey: 'id',
});

module.exports = {
  Packing,
  PACKING_PROPERTIES,
};
