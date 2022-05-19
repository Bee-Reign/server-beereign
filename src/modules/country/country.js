const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../libs/sequelize');
const { models } = require('../../app/config');
const { Province } = require('../province/province');
const { Apiary } = require('../apiary/apiary');
const { Warehouse } = require('../warehouse/warehouse');

const COUNTRY_PROPERTIES = {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
};

class Country extends Model {}

Country.init(COUNTRY_PROPERTIES, {
  sequelize,
  timestamps: false,
  modelName: models.country.modelName,
  tableName: models.country.tableName,
});

Country.hasMany(Province, { foreignKey: 'countryId', sourceKey: 'id' });
Province.belongsTo(Country, { foreignKey: 'countryId', sourceKey: 'id' });

Country.hasMany(Apiary, { foreignKey: 'countryId', sourceKey: 'id' });
Apiary.belongsTo(Country, { foreignKey: 'countryId', sourceKey: 'id' });

Country.hasMany(Warehouse, { foreignKey: 'countryId', sourceKey: 'id' });
Warehouse.belongsTo(Country, { foreignKey: 'countryId', sourceKey: 'id' });

module.exports = {
  Country,
  COUNTRY_PROPERTIES,
};
