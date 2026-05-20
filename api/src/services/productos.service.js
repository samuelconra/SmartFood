const ProductoCatalogo = require('../models/ProductoCatalogo');
const { buildPagination, parsePaginationParams } = require('../utils/response');

const getAll = async (query) => {
  const { page, limit, skip, sort } = parsePaginationParams(query);

  const filter = {};
  if (query.categoria) filter.categoria = query.categoria;
  if (query.proveedor_ref) filter.proveedor_ref = query.proveedor_ref;
  if (query.nombre) filter.$text = { $search: query.nombre };
  if (query.precioMin || query.precioMax) {
    filter.precioEstimado = {};
    if (query.precioMin) filter.precioEstimado.$gte = Number(query.precioMin);
    if (query.precioMax) filter.precioEstimado.$lte = Number(query.precioMax);
  }

  const [data, total] = await Promise.all([
    ProductoCatalogo.find(filter)
      .populate('proveedor_ref', 'nombre correoContacto telefono')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductoCatalogo.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination({ page, limit, total }) };
};

const getById = async (id) =>
  ProductoCatalogo.findById(id)
    .populate('proveedor_ref', 'nombre correoContacto telefono')
    .lean();

const create = async (body) => {
  const producto = new ProductoCatalogo(body);
  return (await producto.save()).populate('proveedor_ref', 'nombre correoContacto telefono');
};

const update = async (id, body) =>
  ProductoCatalogo.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate('proveedor_ref', 'nombre correoContacto telefono')
    .lean();

const remove = async (id) => ProductoCatalogo.findByIdAndDelete(id).lean();

module.exports = { getAll, getById, create, update, remove };
