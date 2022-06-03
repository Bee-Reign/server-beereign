const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');
const { Province } = require('./province');

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
      throw boom.conflict('province name already exist');
    }
  }

  async findAll(limit = 15, offset = 0) {
    const provinces = await Province.findAll({
      order: [['name', 'ASC']],
      limit,
      offset,
    });
    return provinces;
  }

  async findAllByCountryId(countryId, query = '') {
    const provinces = await Province.findAll({
      attributes: { exclude: ['countryId'] },
      order: [['name', 'ASC']],
      where: {
        countryId,
        name: {
          [Op.like]: query + '%',
        },
      },
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
