const models = {
  country: {
    modelName: 'country',
    tableName: 'countries',
  },
  province: {
    modelName: 'province',
    tableName: 'provinces',
  },
  apiary: {
    modelName: 'apiary',
    tableName: 'apiaries',
  },
  typeOfEmployee: {
    modelName: 'typeOfEmployee',
    tableName: 'types_of_employee',
  },
  employee: {
    modelName: 'employee',
    tableName: 'employees',
  },
  rawMaterial: {
    modelName: 'rawMaterial',
    tableName: 'raw_materials',
  },
  warehouse: {
    modelName: 'warehouse',
    tableName: 'warehouses',
  },
  rawMaterialBatch: {
    modelName: 'rawMaterialBatch',
    tableName: 'raw_material_batches',
  },
  product: {
    modelName: 'product',
    tableName: 'products',
  },
  productBatch: {
    modelName: 'productBatch',
    tableName: 'product_batches',
  },
};

module.exports = {
  models,
};
