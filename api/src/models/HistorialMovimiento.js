const mongoose = require('mongoose');

const ACCIONES = ['consumido', 'desperdiciado', 'donado', 'comprado', 'ajuste'];

const historialMovimientoSchema = new mongoose.Schema(
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
    accion: {
      type: String,
      required: [true, 'La acción es obligatoria'],
      enum: {
        values: ACCIONES,
        message: `La acción debe ser una de: ${ACCIONES.join(', ')}`,
      },
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
    },
    valorEstimado: {
      type: Number,
      required: [true, 'El valor estimado es obligatorio'],
      min: [0, 'El valor no puede ser negativo'],
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices — queries más frecuentes: historial por usuario, por fecha, por acción
historialMovimientoSchema.index({ usuario_ref: 1, fecha: -1 });
historialMovimientoSchema.index({ producto_ref: 1, fecha: -1 });
historialMovimientoSchema.index({ accion: 1 });
historialMovimientoSchema.index({ fecha: -1 });

module.exports = mongoose.model('HistorialMovimiento', historialMovimientoSchema, 'historial_movimientos');
