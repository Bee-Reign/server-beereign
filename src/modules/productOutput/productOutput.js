const { DataTypes, Model } = require('sequelize');
const moment = require('moment');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const {
  ProductOutputDetail,
} = require('../productOutputDetail/productOutputDetail');
const {
  config: { TypeOfSale },
} = require('../../app/config');

const PRODUCT_OUTPUT_PROPERTIES = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  typeOfSale: {
    type: DataTypes.ENUM(TypeOfSale.es),
    allowNull: false,
    field: 'type_of_sale',
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  cancelled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
};

class ProductOutput extends Model {}

ProductOutput.init(PRODUCT_OUTPUT_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.productOutput.modelName,
  tableName: models.productOutput.tableName,
});

ProductOutput.hasMany(ProductOutputDetail, {
  foreignKey: 'productOutputId',
  sourceKey: 'id',
});
ProductOutputDetail.belongsTo(ProductOutput, {
  foreignKey: 'productOutputId',
  sourceKey: 'id',
});

module.exports = {
  PRODUCT_OUTPUT_PROPERTIES,
  ProductOutput,
};
