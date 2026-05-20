const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del proveedor es obligatorio'],
      trim: true,
      maxlength: [120, 'El nombre no puede superar 120 caracteres'],
    },
    correoContacto: {
      type: String,
      required: [true, 'El correo de contacto es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Ingresa un correo electrónico válido'],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      match: [/^\d{7,15}$/, 'El teléfono debe contener entre 7 y 15 dígitos'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
proveedorSchema.index({ nombre: 1 });
proveedorSchema.index({ correoContacto: 1 }, { unique: true });

module.exports = mongoose.model('Proveedor', proveedorSchema, 'proveedores');
