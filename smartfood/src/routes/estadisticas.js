import { read, write, nextId } from '../db/database.js'
import { sendError, sendSuccess } from '../utils/response.js'

export function estadisticasRoutes(req, res, body, pathname, usuarioId) {
  if (pathname === '/api/estadisticas' && req.method === 'GET') {
    const insumos = read('insumos').filter(i => i.usuario_id === usuarioId)
    const historial = read('historial_consumo').filter(h => h.usuario_id === usuarioId)
    const proveedores = read('proveedores').filter(p => p.usuario_id === usuarioId)
    const categorias = read('categorias')

    const total = insumos.length
    const activos = insumos.filter(i => i.estado === 'activo').length
    const consumidos = historial.filter(h => h.tipo === 'consumido').length
    const desperdiciados = historial.filter(h => h.tipo === 'desperdiciado').length
    const donados = historial.filter(h => h.tipo === 'donado').length
    const totalProcesados = consumidos + desperdiciados + donados
    const porcentajeAprovechado = totalProcesados > 0 ? Math.round(((consumidos + donados) / totalProcesados) * 100) : 0
    const ahorroEstimado = consumidos * 15

    const proximos = insumos.filter(i => {
      if (i.estado !== 'activo') return false
      const dias = Math.ceil((new Date(i.fecha_caducidad) - new Date()) / (1000 * 60 * 60 * 24))
      return dias <= 3 && dias >= 0
    })

    const lowStock = insumos.filter(i => i.estado === 'activo' && i.stock_minimo > 0 && i.cantidad <= i.stock_minimo)

    const catBreakdown = categorias.map(c => {
      const items = insumos.filter(i => i.categoria_id === c.id)
      const activosCat = items.filter(i => i.estado === 'activo')
      const expiring = activosCat.filter(i => {
        const dias = Math.ceil((new Date(i.fecha_caducidad) - new Date()) / (1000 * 60 * 60 * 24))
        return dias <= 3 && dias >= 0
      })
      return {
        id: c.id,
        nombre: c.nombre,
        total_skus: activosCat.length,
        total_units: activosCat.reduce((s, i) => s + Number(i.cantidad), 0),
        expiring: expiring.length,
      }
    })

    return sendSuccess(res, {
      data: {
        total_insumos: total,
        activos,
        consumidos,
        desperdiciados,
        donados,
        porcentaje_aprovechado: porcentajeAprovechado,
        ahorro_estimado: ahorroEstimado,
        alertas_activas: proximos.length,
        low_stock_count: lowStock.length,
        proveedores_count: proveedores.length,
        cat_breakdown: catBreakdown,
        hist_reciente: historial.slice(-10).reverse(),
      }
    })
  }

  if (pathname === '/api/historial' && req.method === 'POST') {
    const { insumo_id, tipo } = body
    if (!insumo_id || !tipo) {
      return sendError(res, { message: 'insumo_id y tipo son requeridos', statusCode: 400 })
    }

    const historial = read('historial_consumo')
    const registro = {
      id: nextId('historial_consumo'),
      insumo_id: parseInt(insumo_id),
      usuario_id: usuarioId,
      tipo,
      fecha_consumo: new Date().toISOString(),
    }
    historial.push(registro)
    write('historial_consumo', historial)

    const insumos = read('insumos')
    const idx = insumos.findIndex(i => i.id === parseInt(insumo_id) && i.usuario_id === usuarioId)
    if (idx !== -1) {
      insumos[idx].estado = tipo === 'consumido' || tipo === 'donado' ? tipo : 'desperdiciado'
      write('insumos', insumos)
    }

    return sendSuccess(res, { data: registro, statusCode: 201 })
  }

  return false
}
