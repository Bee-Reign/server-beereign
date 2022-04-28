const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { Apiary } = require('../apiary/apiary');

const PROVINCE_PROPERTIES = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  countryId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'country_id',
    references: {
      model: models.country.tableName,
      key: 'id',
    },
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  },
};

class Province extends Model {}

Province.init(PROVINCE_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.province.modelName,
  tableName: models.province.tableName,
});

Province.hasMany(Apiary, { foreignKey: 'provinceId', sourceKey: 'id' });
Apiary.belongsTo(Province, { foreignKey: 'provinceId', sourceKey: 'id' });

module.exports = {
  Province,
  PROVINCE_PROPERTIES,
};
