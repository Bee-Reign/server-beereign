const boom = require('@hapi/boom');
const Op = require('sequelize/lib/operators');

const { Product } = require('./product');

class ProductService {
  constructor() {}

  async productBarcodeExist(barcode = '') {
    const ifExist = await Product.findOne({
      where: {
        barcode,
      },
    });
    if (ifExist) {
      throw boom.badRequest('duplicate key exception');
    }
  }

  async findAll(limit = null, offset = null, filter = '') {
    if (limit === null || offset === null) {
      const products = await Product.findAll({
        attributes: { exclude: ['deleted', 'description'] },
        order: [['id', 'ASC']],
        where: {
          deleted: false,
          name: {
            [Op.like]: '%' + filter + '%',
          },
        },
        limit: 25,
      });
      return products;
    }
    const products = await Product.findAndCountAll({
      attributes: { exclude: ['deleted', 'description'] },
      order: [['id', 'ASC']],
      where: {
        deleted: false,
        name: {
          [Op.like]: '%' + filter + '%',
        },
      },
      limit,
      offset,
    });
    return products;
  }

  async findById(id) {
    const product = await Product.findOne({
      attributes: { exclude: ['deleted'] },
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!product) {
      throw boom.notFound('product not found');
    }
    return product;
  }

  async create(data) {
    await this.productBarcodeExist(data.barcode);
    const product = await Product.create(data);
    delete product.dataValues.deleted;
    delete product.dataValues.description;
    return product;
  }

  async update(id, data) {
    const product = await this.findById(id);
    if (product.barcode != data.barcode) {
      await this.productBarcodeExist(data.barcode);
    }
    await product.update(data);
    delete product.dataValues.deleted;
    delete product.dataValues.description;
    return product;
  }

  async disable(id) {
    const product = await this.findById(id);
    await product.update({
      deleted: true,
    });
  }
}

module.exports = ProductService;
