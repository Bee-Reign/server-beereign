const { ProductOutputDetail } = require('../model/entity/productOutputDetail');

class ProductOutputDetailService {
  async getAllByOutputId(id) {
    const outputsDetail = await ProductOutputDetail.findAll({
      where: {
        productOutputId: id,
      },
    });
    return outputsDetail;
  }

  async createAll(t, id, products) {
    let productOutputDetail;
    try {
      for (let i in products) {
        const { product, stock, unitCost, ...data } = products[i];
        productOutputDetail = await ProductOutputDetail.create(
          {
            productOutputId: id,
            productBatchId: data.id,
            quantity: data.quantityUsed,
            price: data.price,
          },
          { transaction: t }
        );
      }
    } catch (err) {
      throw err;
    }
    return true;
  }
}

module.exports = ProductOutputDetailService;
