// controllers/proveedores.controller.js
const { createCrudController } = require('./crud.factory');
const service = require('../services/proveedores.service');
module.exports = createCrudController(service, 'Proveedor');
