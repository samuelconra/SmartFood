const router = require('express').Router();
const ctrl = require('../controllers/recetas.controller');
const { validateId, recetaRules } = require('../middlewares/validators');

// Filtros: ?usuario_ref=  &nombre=  &tiempoMax=30  &producto_ref=
router.get('/',       ctrl.getAll);
router.get('/:id',    validateId, ctrl.getById);
router.post('/',      recetaRules, ctrl.create);
router.put('/:id',    validateId, recetaRules, ctrl.update);
router.delete('/:id', validateId, ctrl.remove);

module.exports = router;
