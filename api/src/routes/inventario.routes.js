const router = require('express').Router();
const ctrl = require('../controllers/inventario.controller');
const { validateId, inventarioLoteRules } = require('../middlewares/validators');

// Filtros: ?usuario_ref=  &producto_ref=  &unidadMedida=  &diasParaVencer=7  &bajoBumbral=true
router.get('/',       ctrl.getAll);
router.get('/:id',    validateId, ctrl.getById);
router.post('/',      inventarioLoteRules, ctrl.create);
router.put('/:id',    validateId, inventarioLoteRules, ctrl.update);
router.delete('/:id', validateId, ctrl.remove);

module.exports = router;
