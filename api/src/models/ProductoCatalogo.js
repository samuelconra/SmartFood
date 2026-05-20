const mongoose = require('mongoose');

const CATEGORIAS = ['Lácteos', 'Proteína', 'Verduras', 'Carnes', 'Granos', 'Aceites', 'Frutas', 'Bebidas', 'Otros'];

const productoCatalogoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: CATEGORIAS,
        message: `La categoría debe ser una de: ${CATEGORIAS.join(', ')}`,
      },
    },
    precioEstimado: {
      type: Number,
      required: [true, 'El precio estimado es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    proveedor_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proveedor',
      required: [true, 'El proveedor es obligatorio'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices optimizados para filtros frecuentes desde React
productoCatalogoSchema.index({ categoria: 1 });
productoCatalogoSchema.index({ proveedor_ref: 1 });
productoCatalogoSchema.index({ nombre: 'text' }); // búsqueda por texto
productoCatalogoSchema.index({ categoria: 1, nombre: 1 });

module.exports = mongoose.model('ProductoCatalogo', productoCatalogoSchema, 'productos_catalogo');
