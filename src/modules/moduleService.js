const { Module } = require('./module');

class ModuleService {
  async findAll() {
    const modules = await Module.findAll();
    return modules;
  }
}

module.exports = ModuleService;
