const Receta = require('../models/Receta');
const { buildPagination, parsePaginationParams } = require('../utils/response');

const POPULATE_OPTS = [
  { path: 'usuario_ref', select: 'nombre tipo' },
  { path: 'ingredientes.producto_ref', select: 'nombre categoria precioEstimado' },
];

const getAll = async (query) => {
  const { page, limit, skip, sort } = parsePaginationParams(query);

  const filter = {};
  if (query.usuario_ref) filter.usuario_ref = query.usuario_ref;
  if (query.nombre)      filter.$text = { $search: query.nombre };
  if (query.tiempoMax)   filter.tiempoPrepMin = { $lte: Number(query.tiempoMax) };
  if (query.producto_ref) {
    filter['ingredientes.producto_ref'] = query.producto_ref;
  }

  const [data, total] = await Promise.all([
    Receta.find(filter)
      .populate(POPULATE_OPTS)
      .sort(sort || { tiempoPrepMin: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Receta.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination({ page, limit, total }) };
};

const getById = async (id) =>
  Receta.findById(id).populate(POPULATE_OPTS).lean();

const create = async (body) => {
  const receta = new Receta(body);
  return (await receta.save()).populate(POPULATE_OPTS);
};

const update = async (id, body) =>
  Receta.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate(POPULATE_OPTS)
    .lean();

const remove = async (id) => Receta.findByIdAndDelete(id).lean();

module.exports = { getAll, getById, create, update, remove };
