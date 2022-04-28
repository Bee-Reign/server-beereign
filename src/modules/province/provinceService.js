const boom = require('@hapi/boom');

const { Province } = require('./province');
const { CountryService } = require('../country');

const countryService = new CountryService();

class ProvinceService {
  constructor() {}

  async existProvince(name, countryId) {
    const ifExist = await Province.findOne({
      where: {
        name: name,
        countryId: countryId,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll(limit = 2, offset = 0) {
    const provinces = await Province.findAll({
      order: [['name', 'ASC']],
      limit,
      offset,
    });
    return provinces;
  }

  async findById(id) {
    const province = await Province.findByPk(id);
    if (!province) {
      throw new boom.notFound('province not found');
    }
    return province;
  }

  async create(data) {
    await this.existProvince(data.name, data.countryId);
    const country = await countryService.findById(data.countryId);
    const province = await Province.create(data);
    return province;
  }

  async update(id, data) {
    const province = await this.findById(id);
    await province.update(data);
    return province;
  }
}

module.exports = ProvinceService;
