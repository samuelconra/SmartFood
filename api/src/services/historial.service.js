const HistorialMovimiento = require('../models/HistorialMovimiento');
const { buildPagination, parsePaginationParams } = require('../utils/response');

const POPULATE_OPTS = [
  { path: 'usuario_ref', select: 'nombre correo tipo' },
  { path: 'producto_ref', select: 'nombre categoria' },
];

const getAll = async (query) => {
  const { page, limit, skip, sort } = parsePaginationParams(query);

  const filter = {};
  if (query.usuario_ref)  filter.usuario_ref  = query.usuario_ref;
  if (query.producto_ref) filter.producto_ref = query.producto_ref;
  if (query.accion)       filter.accion       = query.accion;

  if (query.fechaDesde || query.fechaHasta) {
    filter.fecha = {};
    if (query.fechaDesde) filter.fecha.$gte = new Date(query.fechaDesde);
    if (query.fechaHasta) filter.fecha.$lte = new Date(query.fechaHasta);
  }

  const [data, total] = await Promise.all([
    HistorialMovimiento.find(filter)
      .populate(POPULATE_OPTS)
      .sort(sort || { fecha: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    HistorialMovimiento.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination({ page, limit, total }) };
};

const getById = async (id) =>
  HistorialMovimiento.findById(id).populate(POPULATE_OPTS).lean();

const create = async (body) => {
  const movimiento = new HistorialMovimiento(body);
  return (await movimiento.save()).populate(POPULATE_OPTS);
};

const update = async (id, body) =>
  HistorialMovimiento.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate(POPULATE_OPTS)
    .lean();

const remove = async (id) => HistorialMovimiento.findByIdAndDelete(id).lean();

/**
 * Resumen estadístico de movimientos por usuario (desperdicio, consumo, etc.)
 */
const getResumenPorUsuario = async (usuarioId) => {
  return HistorialMovimiento.aggregate([
    { $match: { usuario_ref: require('mongoose').Types.ObjectId.createFromHexString(usuarioId) } },
    {
      $group: {
        _id: '$accion',
        totalCantidad: { $sum: '$cantidad' },
        totalValor: { $sum: '$valorEstimado' },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalValor: -1 } },
  ]);
};

module.exports = { getAll, getById, create, update, remove, getResumenPorUsuario };
