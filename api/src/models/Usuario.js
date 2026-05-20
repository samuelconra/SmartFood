const mongoose = require('mongoose');

const TIPOS_USUARIO = ['hogar', 'local'];

const usuarioSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, 'El tipo de usuario es obligatorio'],
      enum: {
        values: TIPOS_USUARIO,
        message: `El tipo debe ser uno de: ${TIPOS_USUARIO.join(', ')}`,
      },
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Ingresa un correo electrónico válido'],
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
usuarioSchema.index({ correo: 1 }, { unique: true });
usuarioSchema.index({ tipo: 1 });
usuarioSchema.index({ fechaRegistro: -1 });

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');
