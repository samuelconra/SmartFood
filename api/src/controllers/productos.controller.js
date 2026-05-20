const { createCrudController } = require('./crud.factory');
const service = require('../services/productos.service');
module.exports = createCrudController(service, 'Producto');
