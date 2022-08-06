const QueryTypes = require('sequelize/lib/query-types');

const { TypeOfEmployeeModule } = require('./typeOfEmployeeModule');

class TypeOfEmployeeModuleService {
  SELECT_ALL_MODULES_QUERY =
    'SELECT module.id, module.name, module.path FROM type_of_employee_modules typeOfEmployeeModule\
  INNER JOIN modules module on typeOfEmployeeModule.module_id = module.id WHERE typeOfEmployeeModule.type_of_employee_id = :id\
  ORDER BY module.name ASC;';
  INSERT_ALL_MODULES_QUERY =
    'INSERT INTO type_of_employee_modules (type_of_employee_id, module_id) VALUES (:typeOfEmployeeId, :module);';

  async findAllModulesByEmployeeId(id) {
    const typeOfEmployeeModules = await TypeOfEmployeeModule.sequelize.query(
      this.SELECT_ALL_MODULES_QUERY,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      }
    );
    return typeOfEmployeeModules;
  }

  async findAllModulesByTypeOfEmployee(id) {
    const data = [];
    const typeOfEmployeeModules = await TypeOfEmployeeModule.findAll({
      attributes: ['moduleId'],
      where: {
        typeOfEmployeeId: id,
      },
      raw: true,
    });
    typeOfEmployeeModules.map((item) => {
      data.push(item.moduleId);
    });
    return data;
  }

  async insertModulesFromTypeOfEmployee(modules, typeOfEmployeeId) {
    const t = await TypeOfEmployeeModule.sequelize.transaction();
    let typeOfEmployeeModule;
    try {
      for (let i in modules) {
        typeOfEmployeeModule = await TypeOfEmployeeModule.sequelize.query(
          this.INSERT_ALL_MODULES_QUERY,
          {
            replacements: {
              typeOfEmployeeId: typeOfEmployeeId,
              module: modules[i],
            },
            type: QueryTypes.INSERT,
            transaction: t,
          }
        );
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
    return true;
  }

  async updateModulesFromTypeOfEmployee(modules, typeOfEmployeeId) {
    const t = await TypeOfEmployeeModule.sequelize.transaction();
    let typeOfEmployeeModule;
    await TypeOfEmployeeModule.destroy({
      where: {
        typeOfEmployeeId: typeOfEmployeeId,
      },
      transaction: t,
    });
    try {
      for (let i in modules) {
        typeOfEmployeeModule = await TypeOfEmployeeModule.sequelize.query(
          this.INSERT_ALL_MODULES_QUERY,
          {
            replacements: {
              typeOfEmployeeId: typeOfEmployeeId,
              module: modules[i],
            },
            type: QueryTypes.INSERT,
            transaction: t,
          }
        );
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
    return true;
  }
}

module.exports = TypeOfEmployeeModuleService;
