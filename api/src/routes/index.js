const router = require('express').Router();

router.use('/proveedores',  require('./proveedores.routes'));
router.use('/usuarios',     require('./usuarios.routes'));
router.use('/productos',    require('./productos.routes'));
router.use('/inventario',   require('./inventario.routes'));
router.use('/historial',    require('./historial.routes'));
router.use('/recetas',      require('./recetas.routes'));

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SmartFood API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: 'v1',
  });
});

module.exports = router;
