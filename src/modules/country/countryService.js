const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { Country } = require('./country');
const { ProvinceService } = require('../province');

const provinceService = new ProvinceService();

class CountryService {
  constructor() {}

  async existCountry(name = '') {
    const ifExist = await Country.findOne({
      where: {
        name,
      },
    });
    if (ifExist) {
      throw boom.conflict('country name already exist');
    }
  }

  async findAll(query = '') {
    const countries = await Country.findAll({
      order: [['name', 'ASC']],
      where: {
        name: {
          [Op.like]: query + '%',
        },
      },
    });
    return countries;
  }

  async findAllProvincesById(id, query) {
    const provinces = await provinceService.findAllByCountryId(id, query);
    return provinces;
  }

  async findById(id) {
    const country = await Country.findByPk(id);
    if (!country) {
      throw boom.notFound('country not found');
    }
    return country;
  }

  async create(data) {
    await this.existCountry(data.name);
    const country = await Country.create(data);
    return country;
  }

  async update(id, data) {
    const country = await this.findById(id);
    await country.update(data);
    return country;
  }
}

module.exports = CountryService;
