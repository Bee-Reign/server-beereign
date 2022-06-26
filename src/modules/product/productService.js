const boom = require('@hapi/boom');
const QueryTypes = require('sequelize/lib/query-types');
const Op = require('sequelize/lib/operators');

const { Product } = require('./product');
const { ProductBatchService } = require('../productBatch');

const productBatchService = new ProductBatchService();
class ProductService {
  COUNT_QUERY =
    'SELECT count(*) AS count FROM products AS product WHERE (product.barcode LIKE :filter OR product.name LIKE :filter)AND product.deleted = false;';
  SELECT_QUERY =
    'SELECT product.id, product.barcode, product.name, product.created_at "createdAt", \
    SUM(CASE WHEN productBatch.deleted = false THEN productBatch.stock ELSE 0 END) stock, \
    ROUND(AVG(CASE WHEN productBatch.deleted = false AND productBatch.stock > 0 THEN productBatch.stock END), 2) "averageCost", \
    ROUND(SUM(CASE WHEN productBatch.deleted = false AND productBatch.stock > 0 THEN productBatch.cost_value ELSE 0 END), 2) amount \
    FROM products product LEFT JOIN product_batches productBatch on product.id = productBatch.product_id \
    WHERE (product.barcode LIKE :filter OR product.name LIKE :filter) AND product.deleted = false \
    GROUP BY product.id, product.barcode, product.name, product.created_at \
    ORDER BY stock ASC limit :limit offset :offset;';
  TOTAL_AMOUNT_QUERY =
    'SELECT round(sum(CASE WHEN productBatch.deleted = false AND productBatch.stock > 0 AND p.deleted = false THEN productBatch.cost_value ELSE 0 END), 2) "totalAmount" \
  FROM product_batches productBatch INNER JOIN products p on p.id = productBatch.product_id;';
  constructor() {}

  async productBarcodeExist(barcode = '') {
    const ifExist = await Product.findOne({
      where: {
        barcode,
      },
    });
    if (ifExist) {
      throw boom.conflict('product barcode already exist');
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
        limit: 20,
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
    if (filter === '') {
      const totalAmount = await Product.sequelize.query(
        this.TOTAL_AMOUNT_QUERY,
        {
          type: QueryTypes.SELECT,
        }
      );
      data.totalAmount = totalAmount[0].totalAmount;
    }
    data.count = count[0].count;
    data.rows = products;
    return data;
  }

  async findAllBatchesByProduct(id, type = 'id') {
    if (type === 'barcode') {
      const product = await Product.findOne({
        where: {
          barcode: id,
          deleted: false,
        },
      });
      if (!product) {
        throw boom.notFound('product not found');
      }
      const productBatches = await productBatchService.findAllByProduct(
        product.id
      );
      return productBatches;
    }
    const productBatches = await productBatchService.findAllByProduct(id);
    return productBatches;
  }

  async findById(id, type = 'id') {
    if (type === 'barcode') {
      const product = await Product.findOne({
        attributes: { exclude: ['deleted'] },
        where: {
          barcode: id,
          deleted: false,
        },
      });
      if (!product) {
        throw boom.notFound('product not found');
      }
      return product;
    }
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
    const batches = await productBatchService.checkIfBatchesExistByProductId(
      product.id
    );
    if (batches === true) {
      throw boom.conflict('there are lots available with this product');
    }
    await product.update({
      deleted: true,
    });
  }
}

module.exports = ProductService;
