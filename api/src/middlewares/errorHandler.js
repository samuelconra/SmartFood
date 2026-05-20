const { sendError } = require('../utils/response');

/**
 * Middleware de manejo centralizado de errores.
 * Debe registrarse DESPUÉS de todas las rutas en server.js
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, { message: 'Error de validación', statusCode: 422, errors });
  }

  // ObjectId inválido (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendError(res, { message: 'ID con formato inválido', statusCode: 400 });
  }

  // Clave duplicada (unique index)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, { message: `El campo '${field}' ya existe en la base de datos`, statusCode: 409 });
  }

  // Error genérico
  sendError(res, { message: err.message || 'Error interno del servidor', statusCode: err.statusCode || 500 });
};

/**
 * Middleware 404 — ruta no encontrada
 */
const notFound = (req, res) => {
  sendError(res, { message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`, statusCode: 404 });
};

module.exports = { errorHandler, notFound };
