const { body, param, validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/** Middleware que ejecuta el resultado de las validaciones */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, {
      message: 'Error de validación en los datos enviados',
      statusCode: 422,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/** Valida que el parámetro :id sea un ObjectId válido */
const validateId = [
  param('id').isMongoId().withMessage('El ID no es un ObjectId válido'),
  validate,
];

// ─── Proveedores ─────────────────────────────────────────────────────────────
const proveedorRules = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 120 }),
  body('correoContacto').trim().isEmail().withMessage('Correo electrónico inválido'),
  body('telefono').trim().matches(/^\d{7,15}$/).withMessage('Teléfono inválido (7-15 dígitos)'),
  validate,
];

// ─── Usuarios ─────────────────────────────────────────────────────────────────
const usuarioRules = [
  body('tipo').isIn(['hogar', 'local']).withMessage('tipo debe ser "hogar" o "local"'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').trim().isEmail().withMessage('Correo electrónico inválido'),
  validate,
];

// ─── Productos catálogo ────────────────────────────────────────────────────────
const CATEGORIAS = ['Lácteos', 'Proteína', 'Verduras', 'Carnes', 'Granos', 'Aceites', 'Frutas', 'Bebidas', 'Otros'];
const productoCatalogoRules = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('categoria').isIn(CATEGORIAS).withMessage(`Categoría inválida. Opciones: ${CATEGORIAS.join(', ')}`),
  body('precioEstimado').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('proveedor_ref').isMongoId().withMessage('proveedor_ref debe ser un ObjectId válido'),
  validate,
];

// ─── Inventario lotes ─────────────────────────────────────────────────────────
const UNIDADES = ['litros', 'piezas', 'kg', 'gramos', 'mililitros', 'unidades'];
const inventarioLoteRules = [
  body('usuario_ref').isMongoId().withMessage('usuario_ref debe ser un ObjectId válido'),
  body('producto_ref').isMongoId().withMessage('producto_ref debe ser un ObjectId válido'),
  body('cantidad').isFloat({ min: 0 }).withMessage('La cantidad debe ser un número no negativo'),
  body('unidadMedida').isIn(UNIDADES).withMessage(`Unidad inválida. Opciones: ${UNIDADES.join(', ')}`),
  body('fechaCaducidad').isISO8601().withMessage('fechaCaducidad debe ser una fecha ISO 8601 válida'),
  body('umbralMinimo').isFloat({ min: 0 }).withMessage('umbralMinimo debe ser un número no negativo'),
  validate,
];

// ─── Historial movimientos ────────────────────────────────────────────────────
const ACCIONES = ['consumido', 'desperdiciado', 'donado', 'comprado', 'ajuste'];
const historialMovimientoRules = [
  body('usuario_ref').isMongoId().withMessage('usuario_ref debe ser un ObjectId válido'),
  body('producto_ref').isMongoId().withMessage('producto_ref debe ser un ObjectId válido'),
  body('accion').isIn(ACCIONES).withMessage(`Acción inválida. Opciones: ${ACCIONES.join(', ')}`),
  body('cantidad').isFloat({ min: 0 }).withMessage('La cantidad debe ser un número no negativo'),
  body('valorEstimado').isFloat({ min: 0 }).withMessage('El valor estimado debe ser un número no negativo'),
  validate,
];

// ─── Recetas ──────────────────────────────────────────────────────────────────
const recetaRules = [
  body('nombre').trim().notEmpty().withMessage('El nombre de la receta es obligatorio'),
  body('instrucciones').trim().notEmpty().withMessage('Las instrucciones son obligatorias'),
  body('tiempoPrepMin').isInt({ min: 1 }).withMessage('El tiempo de preparación debe ser al menos 1 minuto'),
  body('ingredientes').isArray({ min: 1 }).withMessage('La receta debe tener al menos un ingrediente'),
  body('ingredientes.*.producto_ref').isMongoId().withMessage('Cada ingrediente debe tener un producto_ref válido'),
  body('ingredientes.*.nombreProducto').trim().notEmpty().withMessage('El nombre del producto es obligatorio en cada ingrediente'),
  body('ingredientes.*.cantidadRequerida').isFloat({ min: 0 }).withMessage('La cantidad de cada ingrediente debe ser positiva'),
  body('ingredientes.*.unidad').trim().notEmpty().withMessage('La unidad es obligatoria en cada ingrediente'),
  validate,
];

module.exports = {
  validate,
  validateId,
  proveedorRules,
  usuarioRules,
  productoCatalogoRules,
  inventarioLoteRules,
  historialMovimientoRules,
  recetaRules,
};
