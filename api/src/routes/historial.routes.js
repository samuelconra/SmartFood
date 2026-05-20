const router = require('express').Router();
const { param } = require('express-validator');
const { validate } = require('../middlewares/validators');
const ctrl = require('../controllers/historial.controller');
const { validateId, historialMovimientoRules } = require('../middlewares/validators');

// Filtros: ?usuario_ref=  &producto_ref=  &accion=  &fechaDesde=  &fechaHasta=
router.get('/',       ctrl.getAll);
router.get('/:id',    validateId, ctrl.getById);
router.post('/',      historialMovimientoRules, ctrl.create);
router.put('/:id',    validateId, historialMovimientoRules, ctrl.update);
router.delete('/:id', validateId, ctrl.remove);

// Endpoint especial: resumen de movimientos por usuario
router.get(
  '/resumen/:usuarioId',
  [param('usuarioId').isMongoId().withMessage('usuarioId inválido'), validate],
  ctrl.getResumen
);

module.exports = router;
