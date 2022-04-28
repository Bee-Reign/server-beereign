const boom = require('@hapi/boom');

//Models
const { Apiary } = require('./apiary');
const { Country } = require('../country/country');
const { Province } = require('../province/province');

//Services
const { CountryService } = require('../country');
const { ProvinceService } = require('../province');

const countryService = new CountryService();
const provinceService = new ProvinceService();

class ApiaryService {
  constructor() {}

  async apiaryNameExist(name = '') {
    const ifExist = await Apiary.findOne({
      where: {
        name: name,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll(limit = 10, offset = 0) {
    const apiaries = await Apiary.findAll({
      attributes: ['id', 'name', 'city'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
      },
      include: [
        {
          model: Country,
        },
        {
          model: Province,
          attributes: ['id', 'name'],
        },
      ],
      limit: limit,
      offset: offset,
    });
    return apiaries;
  }

  async findById(id) {
    const apiary = await Apiary.findOne({
      attributes: ['id', 'name', 'city', 'location'],
      where: {
        id: id,
        deleted: false,
      },
      include: [
        {
          model: Country,
        },
        {
          model: Province,
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!apiary) {
      throw boom.notFound('apiary not found');
    }
    return apiary;
  }

  async create(data) {
    await this.apiaryNameExist(data.name);
    await countryService.findById(data.countryId);
    await provinceService.findById(data.provinceId);
    const apiary = await Apiary.create(data);
    return apiary;
  }

  async update(id, data) {
    const apiary = await this.findById(id);
    await apiary.update(data);
  }

  async disable() {}
}

module.exports = ApiaryService;
