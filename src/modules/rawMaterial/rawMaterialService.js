const boom = require('@hapi/boom');
const QueryTypes = require('sequelize/lib/query-types');
const Op = require('sequelize/lib/operators');

const { RawMaterial } = require('./rawMaterial');

class RawMaterialService {
  COUNT_QUERY =
    'SELECT count(*) AS count FROM raw_materials AS rawMaterial WHERE (rawMaterial.code LIKE :filter OR rawMaterial.name LIKE :filter) AND rawMaterial.deleted = false;';
  SELECT_QUERY =
    'SELECT rawMaterial.id, rawMaterial.code, rawMaterial.name, rawMaterial.created_at as "createdAt", rawMaterialStockById(rawMaterial.id) AS stock, rawMaterialAverageCost(rawMaterial.id) as "averageCost", rawMaterialCostValue(rawMaterial.id) as amount, rawMaterialMeasurement(rawMaterial.id) as measurement  FROM raw_materials rawMaterial WHERE (rawMaterial.code LIKE :filter OR rawMaterial.name LIKE :filter) AND rawMaterial.deleted = false ORDER BY stock ASC limit :limit offset :offset;';
  constructor() {}

  async rawMaterialCodeExist(code = '') {
    const ifExist = await RawMaterial.findOne({
      where: {
        code,
      },
    });
    if (ifExist) {
      throw boom.conflict('raw material code already exist');
    }
  }

  async findAll(limit = null, offset = null, filter = '') {
    if (limit === null || offset === null) {
      const rawMaterials = await RawMaterial.findAll({
        attributes: { exclude: ['deleted'] },
        order: [['id', 'ASC']],
        where: {
          deleted: false,
          [Op.or]: [
            {
              code: {
                [Op.like]: '%' + filter + '%',
              },
            },
            {
              name: {
                [Op.like]: '%' + filter + '%',
              },
            },
          ],
        },
        limit: 20,
      });
      return rawMaterials;
    }
    const count = await RawMaterial.sequelize.query(this.COUNT_QUERY, {
      replacements: { filter: '%' + filter + '%' },
      type: QueryTypes.SELECT,
    });
    const rawMaterials = await RawMaterial.sequelize.query(this.SELECT_QUERY, {
      replacements: {
        filter: '%' + filter + '%',
        limit: limit,
        offset: offset,
      },
      type: QueryTypes.SELECT,
    });
    const data = {};
    data.count = count[0].count;
    data.rows = rawMaterials;
    return data;
  }

  async findById(id, type = 'id') {
    if (type === 'code') {
      const rawMaterial = await RawMaterial.findOne({
        attributes: ['id', 'code', 'name', 'createdAt'],
        where: {
          code: id,
          deleted: false,
        },
      });
      if (!rawMaterial) {
        throw boom.notFound('raw material not found');
      }
      return rawMaterial;
    }
    const rawMaterial = await RawMaterial.findOne({
      attributes: ['id', 'code', 'name', 'createdAt'],
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!rawMaterial) {
      throw boom.notFound('raw material not found');
    }
    return rawMaterial;
  }

  async create(data) {
    await this.rawMaterialCodeExist(data.code);
    const rawMaterial = await RawMaterial.create(data);
    delete rawMaterial.dataValues.deleted;
    return rawMaterial;
  }

  async update(id, data) {
    const rawMaterial = await this.findById(id);
    if (rawMaterial.code != data.code) {
      await this.rawMaterialCodeExist(data.code);
    }
    await rawMaterial.update(data);
    delete rawMaterial.dataValues.deleted;
    return rawMaterial;
  }

  async disable(id) {
    const rawMaterial = await this.findById(id);
    await rawMaterial.update({
      deleted: true,
    });
  }
}

module.exports = RawMaterialService;
