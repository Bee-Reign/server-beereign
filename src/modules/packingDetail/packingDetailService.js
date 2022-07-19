const { PackingDetail } = require('./packingDetail');
const QueryTypes = require('sequelize/lib/query-types');

class PackingDetailService {
  SELECT_ALL_BY_PACKING_ID =
    'SELECT rawMaterialBatch.id id,  batches.quantity_used "quantityUsed", rawMaterialBatch.stock stock, \
    rawMaterialBatch.unit_cost "unitCost", rawMaterial.name name, rawMaterial.measurement measurement \
    FROM packing_details batches INNER JOIN packings packing on packing.id = batches.packing_id \
    INNER JOIN raw_material_batches rawMaterialBatch on rawMaterialBatch.id = batches.raw_material_batch_id \
    INNER JOIN raw_materials rawMaterial on rawMaterialBatch.raw_material_id = rawMaterial.id \
    WHERE batches.packing_id = :packingId;';
  async createAll(batches, packingId, transaction) {
    try {
      for (let i in batches) {
        const data = batches[i];
        data.packingId = packingId;
        data.rawMaterialBatchId = data.id;
        const packingDetail = await PackingDetail.create(data, {
          transaction: transaction,
        });
      }
      return transaction;
    } catch (err) {
      throw err;
    }
  }

  async findAllByPackingId(packingId) {
    const batches = await PackingDetail.sequelize.query(
      this.SELECT_ALL_BY_PACKING_ID,
      {
        replacements: {
          packingId: packingId,
        },
        type: QueryTypes.SELECT,
      }
    );
    return batches;
  }

  async deleteAllByPackingId(packingId, transaction) {
    const count = await PackingDetail.destroy(
      {
        where: {
          packingId,
        },
      },
      { transaction: transaction }
    );
    return count;
  }
}

module.exports = PackingDetailService;
