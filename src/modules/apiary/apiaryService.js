const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');
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
      throw boom.conflict('apiary name already exist');
    }
  }

  async findAll(limit = null, offset = null, filter = '') {
    if (limit === null || offset === null) {
      const apiaries = await Apiary.findAll({
        attributes: ['id', 'name', 'city'],
        order: [['id', 'ASC']],
        where: {
          deleted: false,
          name: {
            [Op.like]: '%' + filter + '%',
          },
        },
        limit: 25,
      });
      return apiaries;
    }
    const apiaries = await Apiary.findAndCountAll({
      attributes: ['id', 'name', 'city'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
        name: {
          [Op.like]: '%' + filter + '%',
        },
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
    delete apiary.dataValues.deleted;
    return apiary;
  }

  async update(id, data) {
    const apiary = await this.findById(id);
    await apiary.update(data);
    if (apiary.name != data.name) {
      await this.apiaryNameExist(data.name);
    }
    delete apiary.dataValues.deleted;
    return apiary;
  }

  async disable() {}
}

module.exports = ApiaryService;
