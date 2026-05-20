const router = require('express').Router();
const ctrl = require('../controllers/proveedores.controller');
const { validateId, proveedorRules } = require('../middlewares/validators');

// GET    /api/v1/proveedores          → lista paginada (filtros: ?nombre=)
// GET    /api/v1/proveedores/:id      → detalle
// POST   /api/v1/proveedores          → crear
// PUT    /api/v1/proveedores/:id      → actualizar completo
// DELETE /api/v1/proveedores/:id      → eliminar

router.get('/',          ctrl.getAll);
router.get('/:id',       validateId, ctrl.getById);
router.post('/',         proveedorRules, ctrl.create);
router.put('/:id',       validateId, proveedorRules, ctrl.update);
router.delete('/:id',    validateId, ctrl.remove);

module.exports = router;
