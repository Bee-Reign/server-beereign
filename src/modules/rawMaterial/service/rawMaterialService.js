const boom = require('@hapi/boom');
const QueryTypes = require('sequelize/lib/query-types');
const Op = require('sequelize/lib/operators');

const { RawMaterial } = require('../model/entity/rawMaterial');
const { RawMaterialBatchService } = require('../../rawMaterialBatch');

const rawMaterialBatchService = new RawMaterialBatchService();
class RawMaterialService {
  COUNT_QUERY =
    'SELECT count(*) AS count FROM raw_materials AS rawMaterial WHERE (rawMaterial.code LIKE :filter OR rawMaterial.name LIKE :filter) AND rawMaterial.deleted = false;';
  SELECT_QUERY =
    'SELECT rawMaterial.id, rawMaterial.code, rawMaterial.name, rawMaterial.created_at AS "createdAt", \
    SUM(CASE WHEN rawMaterialBatch.deleted = false THEN rawMaterialBatch.stock ELSE 0 END) stock, rawMaterial.measurement, \
    ROUND(AVG(CASE WHEN rawMaterialBatch.deleted = false AND rawMaterialBatch.stock > 0 THEN rawMaterialBatch.unit_cost END), 2) "averageCost", \
    ROUND(SUM(CASE WHEN rawMaterialBatch.deleted = false AND rawMaterialBatch.stock > 0 THEN rawMaterialBatch.cost_value ELSE 0 END), 2) amount \
    FROM raw_materials rawMaterial LEFT JOIN raw_material_batches rawMaterialBatch \
    ON rawMaterial.id = rawMaterialBatch.raw_material_id \
    WHERE (rawMaterial.code LIKE :filter OR rawMaterial.name LIKE :filter) AND rawMaterial.deleted = false \
    GROUP BY rawMaterial.id, rawMaterial.code, rawMaterial.name, "createdAt", rawMaterial.measurement \
    ORDER BY stock ASC limit :limit offset :offset;';
  TOTAL_AMOUNT_QUERY =
    'SELECT round(sum(CASE WHEN rawMaterialBatch.deleted = false AND rawMaterialBatch.stock > 0 AND rm.deleted = false THEN rawMaterialBatch.cost_value ELSE 0 END), 2) "totalAmount" FROM raw_material_batches rawMaterialBatch \
    INNER JOIN raw_materials rm on rm.id = rawMaterialBatch.raw_material_id;';
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
    if (filter === '') {
      const totalAmount = await RawMaterial.sequelize.query(
        this.TOTAL_AMOUNT_QUERY,
        {
          type: QueryTypes.SELECT,
        }
      );
      data.totalAmount = totalAmount[0].totalAmount;
    }
    data.count = count[0].count;
    data.rows = rawMaterials;
    return data;
  }

  async findById(id, type = 'id') {
    if (type === 'code') {
      const rawMaterial = await RawMaterial.findOne({
        attributes: { exclude: ['deleted'] },
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
      attributes: { exclude: ['deleted'] },
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
    const batches =
      await rawMaterialBatchService.checkIfBatchesExistByRawMaterialId(
        rawMaterial.id
      );
    if (batches === true) {
      throw boom.conflict('there are lots available with this raw material');
    }
    await rawMaterial.update({
      deleted: true,
    });
  }
}

module.exports = RawMaterialService;
