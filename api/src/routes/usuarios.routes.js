const router = require('express').Router();
const ctrl = require('../controllers/usuarios.controller');
const { validateId, usuarioRules } = require('../middlewares/validators');

// Filtros disponibles: ?tipo=hogar|local  &nombre=...
router.get('/',       ctrl.getAll);
router.get('/:id',    validateId, ctrl.getById);
router.post('/',      usuarioRules, ctrl.create);
router.put('/:id',    validateId, usuarioRules, ctrl.update);
router.delete('/:id', validateId, ctrl.remove);

module.exports = router;
