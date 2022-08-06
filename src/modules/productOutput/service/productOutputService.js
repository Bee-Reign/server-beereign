const boom = require('@hapi/boom');

const { ProductOutput } = require('../model/entity/productOutput');
const { Employee } = require('../../employee/employee');
const { ProductBatchService } = require('../../productBatch');
const { ProductOutputDetailService } = require('../../productOutputDetail');
const {
  config: { locale },
} = require('../../../app/config');
const TypeOfSale = require('../model/enum/typeOfSale');

const productOutputDetailService = new ProductOutputDetailService();
const productBatchService = new ProductBatchService();
class ProductOutputService {
  constructor() {}

  async findAll(
    limit = 15,
    offset = 0,
    typeOfSale = TypeOfSale[locale][0],
    isPaid = true
  ) {
    const Outputs = await ProductOutput.findAndCountAll({
      attributes: { exclude: ['cancelled', 'employeeId'] },
      order: [['createdAt', 'DESC']],
      where: {
        cancelled: false,
        typeOfSale: typeOfSale,
        isPaid: isPaid,
      },
      include: [
        {
          model: Employee,
          attributes: ['id', 'name', 'lastName'],
        },
      ],
      limit,
      offset,
    });
    return Outputs;
  }

  async findById(id) {
    const output = await ProductOutput.findOne({
      attributes: { exclude: ['cancelled', 'employeeId'] },
      where: {
        id: id,
        cancelled: false,
      },
    });
    if (!output) {
      throw boom.notFound('product output not found');
    }
    return output;
  }

  async create(sub, data) {
    data.employeeId = sub;
    const t = await ProductOutput.sequelize.transaction();
    try {
      data.isPaid = data.typeOfSale === TypeOfSale[locale][0] ? true : false;
      const productOutput = await ProductOutput.create(data, {
        transaction: t,
      });
      await productOutputDetailService.createAll(
        t,
        productOutput.dataValues.id,
        data.batches
      );
      await productBatchService.updateBatches(data.batches);
      delete productOutput.dataValues.deleted;
      await t.commit();
      return productOutput;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async updateOutputIsPaid(id, data) {
    const productOutput = await this.findById(id);
    await productOutput.update(data);
    delete productOutput.dataValues.deleted;
    return productOutput;
  }

  async cancellOutput(id) {
    const output = await this.findById(id);
    await output.update({
      cancelled: true,
    });
  }
}

module.exports = ProductOutputService;
