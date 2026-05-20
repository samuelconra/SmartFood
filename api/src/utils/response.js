/**
 * Genera una respuesta JSON estandarizada para la API.
 * Formato: { success, data, message, pagination? }
 */

const sendSuccess = (res, { data = null, message = 'OK', statusCode = 200, pagination = null } = {}) => {
  const response = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

const sendError = (res, { message = 'Error interno del servidor', statusCode = 500, errors = null } = {}) => {
  const response = { success: false, message, data: null };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Construye el objeto de paginación para incluir en la respuesta.
 */
const buildPagination = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Parsea parámetros de paginación, filtro y orden desde query params.
 */
const parsePaginationParams = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip  = (page - 1) * limit;

  // Orden: campo asc/desc. Ej: ?sort=-fecha  → { fecha: -1 }
  let sort = {};
  if (query.sort) {
    const field = query.sort.startsWith('-') ? query.sort.slice(1) : query.sort;
    const order = query.sort.startsWith('-') ? -1 : 1;
    sort[field] = order;
  }

  return { page, limit, skip, sort };
};

module.exports = { sendSuccess, sendError, buildPagination, parsePaginationParams };
