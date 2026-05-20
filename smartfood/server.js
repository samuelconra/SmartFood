import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { authRoutes } from './src/routes/auth.js'
import { insumosRoutes } from './src/routes/insumos.js'
import { recetasRoutes } from './src/routes/recetas.js'
import { estadisticasRoutes } from './src/routes/estadisticas.js'
import { proveedoresRoutes } from './src/routes/proveedores.js'
import { verifyToken } from './src/middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.join(__dirname, 'public')
const PORT = process.env.PORT || 3000

function parseBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => data += chunk)
    req.on('end', () => {
      try { resolve(JSON.parse(data)) }
      catch { resolve({}) }
    })
  })
}

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(data))
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.jsx': 'application/javascript; charset=utf-8',
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath)
  const contentType = MIME[ext] || 'application/octet-stream'
  try {
    const content = fs.readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  } catch {
    sendJSON(res, 500, { error: 'Error al leer el archivo' })
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    res.end()
    return
  }

  if (pathname.startsWith('/api/')) {
    const body = req.method !== 'GET' ? await parseBody(req) : {}

    if (pathname.startsWith('/api/auth/')) {
      const handled = authRoutes(req, res, body, pathname)
      if (handled !== false) return
    }

    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
      sendJSON(res, 401, { success: false, message: 'Token requerido', data: null })
      return
    }
    const payload = verifyToken(auth.slice(7))
    if (!payload) {
      sendJSON(res, 401, { success: false, message: 'Token inválido o expirado', data: null })
      return
    }

    if (pathname.startsWith('/api/insumos')) {
      insumosRoutes(req, res, body, pathname, payload.id)
      return
    }
    if (pathname.startsWith('/api/proveedores')) {
      proveedoresRoutes(req, res, body, pathname, payload.id)
      return
    }
    if (pathname === '/api/recetas' && req.method === 'POST') {
      recetasRoutes(req, res, body, pathname, payload.id)
      return
    }
    if (pathname === '/api/estadisticas' || pathname === '/api/historial') {
      estadisticasRoutes(req, res, body, pathname, payload.id)
      return
    }

    sendJSON(res, 404, { success: false, message: 'Ruta no encontrada', data: null })
    return
  }

  let filePath = path.join(PUBLIC, pathname === '/' ? 'index.html' : pathname)

  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC, 'index.html')
  }

  serveStatic(res, filePath)
})

server.listen(PORT, () => {
  console.log(`🚀 SmartFood corriendo en http://localhost:${PORT}`)
})
