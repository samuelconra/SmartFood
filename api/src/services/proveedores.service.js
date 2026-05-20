const Proveedor = require('../models/Proveedor');
const { buildPagination, parsePaginationParams } = require('../utils/response');

const getAll = async (query) => {
  const { page, limit, skip, sort } = parsePaginationParams(query);

  const filter = {};
  if (query.nombre) filter.nombre = { $regex: query.nombre, $options: 'i' };

  const [data, total] = await Promise.all([
    Proveedor.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Proveedor.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination({ page, limit, total }) };
};

const getById = async (id) => Proveedor.findById(id).lean();

const create = async (body) => {
  const proveedor = new Proveedor(body);
  return proveedor.save();
};

const update = async (id, body) =>
  Proveedor.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();

const remove = async (id) => Proveedor.findByIdAndDelete(id).lean();

module.exports = { getAll, getById, create, update, remove };
