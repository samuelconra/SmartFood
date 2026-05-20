const mongoose = require('mongoose');

const ingredienteSchema = new mongoose.Schema(
  {
    producto_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductoCatalogo',
      required: [true, 'El producto del ingrediente es obligatorio'],
    },
    nombreProducto: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    cantidadRequerida: {
      type: Number,
      required: [true, 'La cantidad requerida es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
    },
    unidad: {
      type: String,
      required: [true, 'La unidad es obligatoria'],
      trim: true,
    },
  },
  { _id: false }
);

const recetaSchema = new mongoose.Schema(
  {
    usuario_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre de la receta es obligatorio'],
      trim: true,
      maxlength: [150, 'El nombre no puede superar 150 caracteres'],
    },
    instrucciones: {
      type: String,
      required: [true, 'Las instrucciones son obligatorias'],
      trim: true,
    },
    tiempoPrepMin: {
      type: Number,
      required: [true, 'El tiempo de preparación es obligatorio'],
      min: [1, 'El tiempo debe ser al menos 1 minuto'],
    },
    ingredientes: {
      type: [ingredienteSchema],
      validate: {
        validator: (arr) => arr && arr.length > 0,
        message: 'La receta debe tener al menos un ingrediente',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
recetaSchema.index({ usuario_ref: 1 });
recetaSchema.index({ nombre: 'text' });                         // búsqueda de recetas por nombre
recetaSchema.index({ 'ingredientes.producto_ref': 1 });         // recetas que usan cierto producto
recetaSchema.index({ tiempoPrepMin: 1 });

module.exports = mongoose.model('Receta', recetaSchema, 'recetas');
