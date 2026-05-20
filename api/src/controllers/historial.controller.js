const { createCrudController } = require('./crud.factory');
const { sendSuccess, sendError } = require('../utils/response');
const service = require('../services/historial.service');

const base = createCrudController(service, 'Movimiento');

const getResumen = async (req, res) => {
  try {
    const data = await service.getResumenPorUsuario(req.params.usuarioId);
    sendSuccess(res, { data, message: 'Resumen de movimientos por acción' });
  } catch (err) {
    sendError(res, { message: err.message });
  }
};

module.exports = { ...base, getResumen };
