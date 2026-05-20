import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', '..', 'data')

const files = ['usuarios', 'categorias', 'insumos', 'historial_consumo', 'recetas', 'proveedores']

const defaults = {
  categorias: [
    { id: 1, nombre: 'Dairy', descripcion: 'Lácteos y derivados' },
    { id: 2, nombre: 'Produce', descripcion: 'Verduras y frutas' },
    { id: 3, nombre: 'Bakery', descripcion: 'Panadería y repostería' },
    { id: 4, nombre: 'Meat & Fish', descripcion: 'Carnes y pescados' },
    { id: 5, nombre: 'Pantry', descripcion: 'Despensa y abarrotes' },
    { id: 6, nombre: 'Frozen', descripcion: 'Congelados' },
  ],
  proveedores: [
    { id: 1, usuario_id: 0, nombre: 'Green Valley Farms', email: 'orders@greenvalley.co', telefono: '+1 415 555 0142', created_at: new Date().toISOString() },
    { id: 2, usuario_id: 0, nombre: 'Northbay Dairy Co.', email: 'supply@northbaydairy.com', telefono: '+1 415 555 0177', created_at: new Date().toISOString() },
    { id: 3, usuario_id: 0, nombre: 'Harbor Fish Market', email: 'wholesale@harborfish.com', telefono: '+1 415 555 0188', created_at: new Date().toISOString() },
    { id: 4, usuario_id: 0, nombre: 'Stoneoven Bakery', email: 'fulfilment@stoneoven.com', telefono: '+1 415 555 0119', created_at: new Date().toISOString() },
    { id: 5, usuario_id: 0, nombre: 'Pacific Pantry', email: 'sales@pacificpantry.com', telefono: '+1 415 555 0163', created_at: new Date().toISOString() },
  ],
  insumos: [
    { id: 1, usuario_id: 0, categoria_id: 3, nombre: 'Sourdough loaf', sku: 'SF-B-0007', cantidad: 4, unidad: 'ea', stock_minimo: 5, precio_unitario: 8.50, proveedor_id: 4, fecha_caducidad: '2026-05-19', fecha_compra: '2026-05-12', estado: 'activo', created_at: new Date().toISOString() },
    { id: 2, usuario_id: 0, categoria_id: 1, nombre: 'Whole milk, 1 gal', sku: 'SF-D-0014', cantidad: 12, unidad: 'gal', stock_minimo: 3, precio_unitario: 4.50, proveedor_id: 2, fecha_caducidad: '2026-05-20', fecha_compra: '2026-05-13', estado: 'activo', created_at: new Date().toISOString() },
    { id: 3, usuario_id: 0, categoria_id: 2, nombre: 'Baby spinach', sku: 'SF-P-0034', cantidad: 6, unidad: 'lb', stock_minimo: 5, precio_unitario: 3.25, proveedor_id: 1, fecha_caducidad: '2026-05-20', fecha_compra: '2026-05-14', estado: 'activo', created_at: new Date().toISOString() },
    { id: 4, usuario_id: 0, categoria_id: 4, nombre: 'Atlantic salmon', sku: 'SF-M-0011', cantidad: 9, unidad: 'lb', stock_minimo: 3, precio_unitario: 14.00, proveedor_id: 3, fecha_caducidad: '2026-05-21', fecha_compra: '2026-05-15', estado: 'activo', created_at: new Date().toISOString() },
    { id: 5, usuario_id: 0, categoria_id: 3, nombre: 'Brioche buns, 8pk', sku: 'SF-B-0012', cantidad: 7, unidad: 'pk', stock_minimo: 4, precio_unitario: 6.75, proveedor_id: 4, fecha_caducidad: '2026-05-22', fecha_compra: '2026-05-16', estado: 'activo', created_at: new Date().toISOString() },
    { id: 6, usuario_id: 0, categoria_id: 2, nombre: 'Roma tomatoes', sku: 'SF-P-0021', cantidad: 28, unidad: 'lb', stock_minimo: 10, precio_unitario: 2.50, proveedor_id: 1, fecha_caducidad: '2026-05-23', fecha_compra: '2026-05-17', estado: 'activo', created_at: new Date().toISOString() },
    { id: 7, usuario_id: 0, categoria_id: 1, nombre: 'Greek yogurt, 32oz', sku: 'SF-D-0019', cantidad: 16, unidad: 'ea', stock_minimo: 6, precio_unitario: 5.00, proveedor_id: 2, fecha_caducidad: '2026-05-26', fecha_compra: '2026-05-18', estado: 'activo', created_at: new Date().toISOString() },
    { id: 8, usuario_id: 0, categoria_id: 2, nombre: 'Garlic bulbs', sku: 'SF-P-0052', cantidad: 14, unidad: 'lb', stock_minimo: 3, precio_unitario: 2.00, proveedor_id: 1, fecha_caducidad: '2026-06-01', fecha_compra: '2026-05-18', estado: 'activo', created_at: new Date().toISOString() },
    { id: 9, usuario_id: 0, categoria_id: 1, nombre: 'Aged parmesan', sku: 'SF-D-0023', cantidad: 3, unidad: 'lb', stock_minimo: 5, precio_unitario: 12.00, proveedor_id: 2, fecha_caducidad: '2026-06-08', fecha_compra: '2026-05-18', estado: 'activo', created_at: new Date().toISOString() },
    { id: 10, usuario_id: 0, categoria_id: 6, nombre: 'Frozen peas', sku: 'SF-F-0008', cantidad: 30, unidad: 'lb', stock_minimo: 10, precio_unitario: 3.00, proveedor_id: 5, fecha_caducidad: '2026-08-16', fecha_compra: '2026-05-10', estado: 'activo', created_at: new Date().toISOString() },
    { id: 11, usuario_id: 0, categoria_id: 5, nombre: 'Olive oil, 1L', sku: 'SF-PA-0044', cantidad: 22, unidad: 'ea', stock_minimo: 4, precio_unitario: 11.00, proveedor_id: 5, fecha_caducidad: '2026-11-14', fecha_compra: '2026-05-01', estado: 'activo', created_at: new Date().toISOString() },
    { id: 12, usuario_id: 0, categoria_id: 5, nombre: 'Arborio rice, 2lb', sku: 'SF-PA-0061', cantidad: 18, unidad: 'ea', stock_minimo: 4, precio_unitario: 7.50, proveedor_id: 5, fecha_caducidad: '2027-05-18', fecha_compra: '2026-05-01', estado: 'activo', created_at: new Date().toISOString() },
  ],
}

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

for (const name of files) {
  const p = path.join(DATA_DIR, `${name}.json`)
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(defaults[name] || [], null, 2))
  }
}

export function read(name) {
  const p = path.join(DATA_DIR, `${name}.json`)
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

export function write(name, data) {
  const p = path.join(DATA_DIR, `${name}.json`)
  fs.writeFileSync(p, JSON.stringify(data, null, 2))
}

export function nextId(name) {
  const items = read(name)
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
}

export function copyDefaultsForUser(usuarioId) {
  const proveedores = read('proveedores')
  const insumos = read('insumos')
  const userProveedores = proveedores.filter(p => p.usuario_id === 0)
  const userInsumos = insumos.filter(i => i.usuario_id === 0)

  let maxProvId = Math.max(...proveedores.map(p => p.id), 0)
  let maxInsId = Math.max(...insumos.map(i => i.id), 0)
  const idMap = {}

  for (const p of userProveedores) {
    const oldId = p.id
    const newId = ++maxProvId
    idMap[oldId] = newId
    proveedores.push({ ...p, id: newId, usuario_id: usuarioId })
  }
  for (const i of userInsumos) {
    const newId = ++maxInsId
    insumos.push({
      ...i,
      id: newId,
      usuario_id: usuarioId,
      proveedor_id: idMap[i.proveedor_id] || null,
      created_at: new Date().toISOString()
    })
  }
  write('proveedores', proveedores)
  write('insumos', insumos)
}
