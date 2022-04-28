const boom = require('@hapi/boom');

const { Country } = require('./country');

class CountryService {
  constructor() {}

  async existCountry(name = '') {
    const ifExist = await Country.findOne({
      where: {
        name,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll() {
    const countries = await Country.findAll({
      order: [['name', 'ASC']],
    });
    return countries;
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
