const boom = require('@hapi/boom');
const QueryTypes = require('sequelize/lib/query-types');
const Op = require('sequelize/lib/operators');

const { Product } = require('./product');

class ProductService {
  COUNT_QUERY =
    'SELECT count(*) AS count FROM products products WHERE (products.barcode LIKE :filter OR products.name LIKE :filter) AND products.deleted = false;';
  SELECT_QUERY =
    'SELECT product.id, product.barcode, product.name, product.created_at as "createdAt", productStockById(product.id) AS stock,\
    productAverageCost(product.id) as "averageCost", productCostValue(product.id) as amount\
    FROM products product WHERE (product.barcode LIKE :filter OR product.name LIKE :filter) AND product.deleted = false\
    ORDER BY stock ASC limit :limit offset :offset;';
  constructor() {}

  async productBarcodeExist(barcode = '') {
    const ifExist = await Product.findOne({
      where: {
        barcode,
      },
    });
    if (ifExist) {
      throw boom.conflict('duplicate key exception');
    }
  }

  async findAll(limit = null, offset = null, filter = '') {
    if (limit === null || offset === null) {
      const products = await Product.findAll({
        attributes: { exclude: ['deleted', 'description'] },
        order: [['id', 'ASC']],
        where: {
          deleted: false,
          [Op.or]: [
            {
              barcode: {
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
        limit: 25,
      });
      return products;
    }
    const count = await Product.sequelize.query(this.COUNT_QUERY, {
      replacements: { filter: '%' + filter + '%' },
      type: QueryTypes.SELECT,
    });
    const products = await Product.sequelize.query(this.SELECT_QUERY, {
      replacements: {
        filter: '%' + filter + '%',
        limit: limit,
        offset: offset,
      },
      type: QueryTypes.SELECT,
    });
    const data = {};
    data.count = count[0].count;
    data.rows = products;
    return data;
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
