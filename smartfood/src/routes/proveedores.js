import { read, write, nextId } from '../db/database.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { validate, required, isEmail } from '../utils/validators.js'

export function proveedoresRoutes(req, res, body, pathname, usuarioId) {
  const base = '/api/proveedores'

  if (pathname === base && req.method === 'GET') {
    const proveedores = read('proveedores').filter(p => p.usuario_id === usuarioId)
    const insumos = read('insumos').filter(i => i.usuario_id === usuarioId && i.estado === 'activo')
    const data = proveedores.map(p => ({
      ...p,
      productos_count: insumos.filter(i => i.proveedor_id === p.id).length,
      low_stock_count: insumos.filter(i => i.proveedor_id === p.id && i.cantidad <= i.stock_minimo).length,
    }))
    return sendSuccess(res, { data })
  }

  if (pathname === base && req.method === 'POST') {
    const errors = validate({
      nombre: [required('El nombre es requerido')],
      email: [required('El email es requerido'), isEmail()],
    }, body)
    if (errors) return sendError(res, { message: 'Error de validación', statusCode: 400, errors })

    const { nombre, email, telefono } = body
    const proveedores = read('proveedores')
    const proveedor = { id: nextId('proveedores'), usuario_id: usuarioId, nombre, email, telefono: telefono || '', created_at: new Date().toISOString() }
    proveedores.push(proveedor)
    write('proveedores', proveedores)
    return sendSuccess(res, { data: proveedor, statusCode: 201 })
  }

  const match = pathname.match(/^\/api\/proveedores\/(\d+)$/)
  if (match) {
    const id = parseInt(match[1])
    const proveedores = read('proveedores')
    const idx = proveedores.findIndex(p => p.id === id && p.usuario_id === usuarioId)
    if (idx === -1) {
      return sendError(res, { message: 'Proveedor no encontrado', statusCode: 404 })
    }
    if (req.method === 'PUT') {
      const { nombre, email, telefono } = body
      if (nombre) proveedores[idx].nombre = nombre
      if (email) proveedores[idx].email = email
      if (telefono !== undefined) proveedores[idx].telefono = telefono
      write('proveedores', proveedores)
      return sendSuccess(res, { data: proveedores[idx] })
    }
    if (req.method === 'DELETE') {
      proveedores.splice(idx, 1)
      write('proveedores', proveedores)
      return sendSuccess(res, { data: { id }, message: 'Proveedor eliminado' })
    }
  }

  return false
}
