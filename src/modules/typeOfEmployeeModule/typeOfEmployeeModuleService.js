const QueryTypes = require('sequelize/lib/query-types');

const { TypeOfEmployeeModule } = require('./typeOfEmployeeModule');

class TypeOfEmployeeModuleService {
  SELECT_ALL_MODULES_QUERY =
    'SELECT module.id, module.name, module.path FROM type_of_employee_modules typeOfEmployeeModule\
  INNER JOIN modules module on typeOfEmployeeModule.module_id = module.id WHERE typeOfEmployeeModule.type_of_employee_id = :id\
  ORDER BY module.name ASC;';
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
}

module.exports = TypeOfEmployeeModuleService;
