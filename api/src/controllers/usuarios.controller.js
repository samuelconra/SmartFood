const { createCrudController } = require('./crud.factory');
const service = require('../services/usuarios.service');
module.exports = createCrudController(service, 'Usuario');
