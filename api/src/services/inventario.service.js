const InventarioLote = require('../models/InventarioLote');
const { buildPagination, parsePaginationParams } = require('../utils/response');

const POPULATE_OPTS = [
  { path: 'usuario_ref', select: 'nombre correo tipo' },
  { path: 'producto_ref', select: 'nombre categoria precioEstimado', populate: { path: 'proveedor_ref', select: 'nombre' } },
];

const getAll = async (query) => {
  const { page, limit, skip, sort } = parsePaginationParams(query);

  const filter = {};
  if (query.usuario_ref)  filter.usuario_ref  = query.usuario_ref;
  if (query.producto_ref) filter.producto_ref = query.producto_ref;
  if (query.unidadMedida) filter.unidadMedida = query.unidadMedida;

  // Filtrar lotes próximos a vencer (en X días)
  if (query.diasParaVencer) {
    const limite = new Date();
    limite.setDate(limite.getDate() + Number(query.diasParaVencer));
    filter.fechaCaducidad = { $lte: limite };
  }

  // Filtrar lotes bajo umbral mínimo
  if (query.bajoBumbral === 'true') {
    filter.$expr = { $lte: ['$cantidad', '$umbralMinimo'] };
  }

  const [data, total] = await Promise.all([
    InventarioLote.find(filter)
      .populate(POPULATE_OPTS)
      .sort(sort || { fechaCaducidad: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    InventarioLote.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination({ page, limit, total }) };
};

const getById = async (id) =>
  InventarioLote.findById(id).populate(POPULATE_OPTS).lean();

const create = async (body) => {
  const lote = new InventarioLote(body);
  return (await lote.save()).populate(POPULATE_OPTS);
};

const update = async (id, body) =>
  InventarioLote.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate(POPULATE_OPTS)
    .lean();

const remove = async (id) => InventarioLote.findByIdAndDelete(id).lean();

module.exports = { getAll, getById, create, update, remove };
