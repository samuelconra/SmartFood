const { createCrudController } = require('./crud.factory');
const service = require('../services/recetas.service');
module.exports = createCrudController(service, 'Receta');
