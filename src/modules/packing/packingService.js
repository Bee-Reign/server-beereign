const { ProductBatchService } = require('../productBatch');

const productBatchService = new ProductBatchService();
class PackingService {
  async findAllInProcess(limit, offset) {
    const allInProcess = await productBatchService.findAllInProcess(
      limit,
      offset
    );
    return allInProcess;
  }

  async findOneInProcessById(id) {
    const inProcess = await productBatchService.findOneInProcessById(id);
    return inProcess;
  }

  async updateBatchSaved(sub, id, data) {
    const productBatch = await productBatchService.updateBatchSaved(
      sub,
      id,
      data
    );
    return productBatch;
  }
}

module.exports = PackingService;
