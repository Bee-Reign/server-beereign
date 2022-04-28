const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');

const APIARY_PROPERTIES = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  countryId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'country_id',
    references: {
      model: models.country.tableName,
      key: 'id',
    },
  },
  provinceId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'province_id',
    references: {
      model: models.province.tableName,
      key: 'id',
    },
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

class Apiary extends Model {}

Apiary.init(APIARY_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.apiary.modelName,
  tableName: models.apiary.tableName,
});

module.exports = {
  Apiary,
  APIARY_PROPERTIES,
};
