import { read, write, nextId } from '../db/database.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { validate, required } from '../utils/validators.js'

function generarSku(categoriaId, insumos) {
  const catMap = { 1: 'D', 2: 'P', 3: 'B', 4: 'M', 5: 'PA', 6: 'F' }
  const prefix = catMap[categoriaId] || 'O'
  const existentes = insumos.filter(i => i.sku && i.sku.startsWith(`SF-${prefix}`))
  const nums = existentes.map(i => parseInt(i.sku.split('-')[2]) || 0)
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `SF-${prefix}-${String(next).padStart(4, '0')}`
}

export function insumosRoutes(req, res, body, pathname, usuarioId) {
  const base = '/api/insumos'

  if (pathname === base && req.method === 'GET') {
    const insumos = read('insumos').filter(i => i.usuario_id === usuarioId)
    const categorias = read('categorias')
    const proveedores = read('proveedores').filter(p => p.usuario_id === usuarioId)
    const enriched = insumos.map(i => {
      const prov = proveedores.find(p => p.id === i.proveedor_id)
      const cat = categorias.find(c => c.id === i.categoria_id)
      const dias = Math.ceil((new Date(i.fecha_caducidad) - new Date()) / (1000 * 60 * 60 * 24))
      return {
        ...i,
        categoria_nombre: cat ? cat.nombre : 'Sin categoría',
        proveedor: prov ? { id: prov.id, nombre: prov.nombre, email: prov.email } : null,
        dias_restantes: dias,
        low_stock: i.cantidad <= (i.stock_minimo || 0),
      }
    })
    return sendSuccess(res, { data: { insumos: enriched, categorias } })
  }

  if (pathname === base && req.method === 'POST') {
    const errors = validate({
      nombre: [required('El nombre es requerido')],
      categoria_id: [required('La categoría es requerida')],
      fecha_caducidad: [required('La fecha de caducidad es requerida')],
    }, body)
    if (errors) return sendError(res, { message: 'Error de validación', statusCode: 400, errors })

    const { nombre, categoria_id, cantidad, unidad, fecha_caducidad, proveedor_id, precio_unitario, stock_minimo } = body
    const insumos = read('insumos')
    const sku = generarSku(parseInt(categoria_id), insumos)
    const insumo = {
      id: nextId('insumos'),
      usuario_id: usuarioId,
      categoria_id: parseInt(categoria_id),
      nombre,
      sku,
      cantidad: cantidad || 1,
      unidad: unidad || 'ea',
      stock_minimo: stock_minimo || 0,
      precio_unitario: precio_unitario || 0,
      proveedor_id: proveedor_id || null,
      fecha_caducidad,
      fecha_compra: new Date().toISOString().split('T')[0],
      estado: 'activo',
      created_at: new Date().toISOString(),
    }
    insumos.push(insumo)
    write('insumos', insumos)
    return sendSuccess(res, { data: insumo, statusCode: 201 })
  }

  const match = pathname.match(/^\/api\/insumos\/(\d+)$/)
  if (match) {
    const id = parseInt(match[1])
    const insumos = read('insumos')
    const idx = insumos.findIndex(i => i.id === id && i.usuario_id === usuarioId)

    if (idx === -1) {
      return sendError(res, { message: 'Producto no encontrado', statusCode: 404 })
    }

    if (req.method === 'PUT') {
      const { nombre, categoria_id, cantidad, unidad, fecha_caducidad, estado, proveedor_id, precio_unitario, stock_minimo } = body
      if (nombre) insumos[idx].nombre = nombre
      if (categoria_id) insumos[idx].categoria_id = parseInt(categoria_id)
      if (cantidad) insumos[idx].cantidad = cantidad
      if (unidad) insumos[idx].unidad = unidad
      if (fecha_caducidad) insumos[idx].fecha_caducidad = fecha_caducidad
      if (estado) insumos[idx].estado = estado
      if (proveedor_id !== undefined) insumos[idx].proveedor_id = proveedor_id
      if (precio_unitario !== undefined) insumos[idx].precio_unitario = precio_unitario
      if (stock_minimo !== undefined) insumos[idx].stock_minimo = stock_minimo
      write('insumos', insumos)
      return sendSuccess(res, { data: insumos[idx] })
    }

    if (req.method === 'DELETE') {
      insumos.splice(idx, 1)
      write('insumos', insumos)
      return sendSuccess(res, { data: { id }, message: 'Producto eliminado' })
    }
  }

  return false
}
