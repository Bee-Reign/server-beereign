const boom = require('@hapi/boom');
const res = require('express/lib/response');

const { RawMaterial } = require('./rawMaterial');

class RawMaterialService {
  constructor() {}

  async rawMaterialCodeExist(code = '') {
    const ifExist = await RawMaterial.findOne({
      where: {
        code,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll() {
    const rawMaterials = await RawMaterial.findAll({
      attributes: ['id', 'code', 'name', 'createdAt'],
      order: [['id', 'ASC']],
      where: {
        deleted: false,
      },
    });
    return rawMaterials;
  }

  async findById(id) {
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
    return rawMaterial;
  }

  async update(id, data) {
    const rawMaterial = await this.findById(id);
    if (rawMaterial.code != data.code) {
      await this.rawMaterialCodeExist(data.code);
    }
    await rawMaterial.update(data);
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
