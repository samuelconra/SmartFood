const router = require('express').Router();
const ctrl = require('../controllers/productos.controller');
const { validateId, productoCatalogoRules } = require('../middlewares/validators');

// Filtros disponibles: ?categoria=  &proveedor_ref=  &nombre=  &precioMin=  &precioMax=
router.get('/',       ctrl.getAll);
router.get('/:id',    validateId, ctrl.getById);
router.post('/',      productoCatalogoRules, ctrl.create);
router.put('/:id',    validateId, productoCatalogoRules, ctrl.update);
router.delete('/:id', validateId, ctrl.remove);

module.exports = router;
