/**
 * Factory que genera un controlador CRUD estándar
 * a partir de un servicio con los métodos: getAll, getById, create, update, remove
 */
const { sendSuccess, sendError } = require('../utils/response');

const createCrudController = (service, resourceName) => ({

  getAll: async (req, res) => {
    try {
      const { data, pagination } = await service.getAll(req.query);
      sendSuccess(res, { data, pagination, message: `${resourceName} obtenidos correctamente` });
    } catch (err) {
      sendError(res, { message: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const doc = await service.getById(req.params.id);
      if (!doc) return sendError(res, { message: `${resourceName} no encontrado`, statusCode: 404 });
      sendSuccess(res, { data: doc });
    } catch (err) {
      sendError(res, { message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const doc = await service.create(req.body);
      sendSuccess(res, { data: doc, message: `${resourceName} creado correctamente`, statusCode: 201 });
    } catch (err) {
      if (err.code === 11000) {
        return sendError(res, { message: 'Ya existe un registro con ese dato único', statusCode: 409 });
      }
      sendError(res, { message: err.message, statusCode: 400 });
    }
  },

  update: async (req, res) => {
    try {
      const doc = await service.update(req.params.id, req.body);
      if (!doc) return sendError(res, { message: `${resourceName} no encontrado`, statusCode: 404 });
      sendSuccess(res, { data: doc, message: `${resourceName} actualizado correctamente` });
    } catch (err) {
      sendError(res, { message: err.message, statusCode: 400 });
    }
  },

  remove: async (req, res) => {
    try {
      const doc = await service.remove(req.params.id);
      if (!doc) return sendError(res, { message: `${resourceName} no encontrado`, statusCode: 404 });
      sendSuccess(res, { data: null, message: `${resourceName} eliminado correctamente` });
    } catch (err) {
      sendError(res, { message: err.message });
    }
  },
});

module.exports = { createCrudController };
