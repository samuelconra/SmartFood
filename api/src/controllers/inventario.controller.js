const { createCrudController } = require('./crud.factory');
const service = require('../services/inventario.service');

const base = createCrudController(service, 'Lote');
module.exports = base;
