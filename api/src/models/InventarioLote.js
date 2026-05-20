const mongoose = require('mongoose');

const UNIDADES = ['litros', 'piezas', 'kg', 'gramos', 'mililitros', 'unidades'];

const inventarioLoteSchema = new mongoose.Schema(
  {
    usuario_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio'],
    },
    producto_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductoCatalogo',
      required: [true, 'El producto es obligatorio'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
    },
    unidadMedida: {
      type: String,
      required: [true, 'La unidad de medida es obligatoria'],
      enum: {
        values: UNIDADES,
        message: `La unidad debe ser una de: ${UNIDADES.join(', ')}`,
      },
    },
    fechaCaducidad: {
      type: Date,
      required: [true, 'La fecha de caducidad es obligatoria'],
    },
    umbralMinimo: {
      type: Number,
      required: [true, 'El umbral mínimo es obligatorio'],
      min: [0, 'El umbral mínimo no puede ser negativo'],
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices — el más crítico: lotes de un usuario ordenados por caducidad
inventarioLoteSchema.index({ usuario_ref: 1, fechaCaducidad: 1 });
inventarioLoteSchema.index({ producto_ref: 1 });
inventarioLoteSchema.index({ fechaCaducidad: 1 });                     // alertas de vencimiento
inventarioLoteSchema.index({ usuario_ref: 1, producto_ref: 1 });

module.exports = mongoose.model('InventarioLote', inventarioLoteSchema, 'inventario_lotes');
