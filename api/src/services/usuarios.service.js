const Usuario = require('../models/Usuario');
const { buildPagination, parsePaginationParams } = require('../utils/response');

const getAll = async (query) => {
  const { page, limit, skip, sort } = parsePaginationParams(query);

  const filter = {};
  if (query.tipo) filter.tipo = query.tipo;
  if (query.nombre) filter.nombre = { $regex: query.nombre, $options: 'i' };

  const [data, total] = await Promise.all([
    Usuario.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Usuario.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination({ page, limit, total }) };
};

const getById = async (id) => Usuario.findById(id).lean();

const create = async (body) => {
  const usuario = new Usuario(body);
  return usuario.save();
};

const update = async (id, body) =>
  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();

const remove = async (id) => Usuario.findByIdAndDelete(id).lean();

module.exports = { getAll, getById, create, update, remove };
