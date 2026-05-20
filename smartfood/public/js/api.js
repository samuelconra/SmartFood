const API = window.location.origin

const SF_DATA = {
  CATEGORIES: [],
  SUPPLIERS: [],
  PRODUCTS: [],
  RECIPES: []
}

const icons = {
  Plus: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  Box: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  Bell: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  Mail: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  Chevron: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  Search: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  X: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  Spark: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  Chef: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 13.87A4 4 0 0 1 8 6.41V4a4 4 0 1 1 8 0v2.41a4 4 0 0 1 2 7.46"/><path d="M6 13.87V18a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-4.13"/></svg>`,
  Truck: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  Edit: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  Trash: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  Check: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  Google: (s) => `<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>`,
}

const I = {}
for (const [k,v] of Object.entries(icons)) {
  I[k] = ({ size=16 } = {}) => `<span class="icon">${v(size)}</span>`
}

function daysBetween(dateStr) {
  if (!dateStr) return 999
  const d = new Date(dateStr)
  const now = new Date()
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month:'short', day:'numeric' })
}

function autoSku(catName) {
  const prefix = catName ? catName.replace(/[^A-Z]/g, '').slice(0,2) || catName.slice(0,2).toUpperCase() : "XX"
  const n = String(Math.floor(Math.random() * 9000) + 1000)
  return `SF-${prefix}-${n}`
}

async function request(method, path, data = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  const token = localStorage.getItem('token')
  if (token) opts.headers['Authorization'] = `Bearer ${token}`
  if (data) opts.body = JSON.stringify(data)
  const res = await fetch(`${API}${path}`, opts)
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || json.error || 'Error del servidor')
  return json.data !== undefined ? json.data : json
}

const api = {
  login: (email, password) => request('POST', '/api/auth/login', { email, password }),
  register: (nombre, email, password) => request('POST', '/api/auth/register', { nombre, email, password }),
  getInsumos: () => request('GET', '/api/insumos'),
  addInsumo: (data) => request('POST', '/api/insumos', data),
  updateInsumo: (id, data) => request('PUT', `/api/insumos/${id}`, data),
  deleteInsumo: (id) => request('DELETE', `/api/insumos/${id}`),
  getRecetas: () => request('POST', '/api/recetas'),
  getEstadisticas: () => request('GET', '/api/estadisticas'),
  addHistorial: (insumo_id, tipo) => request('POST', '/api/historial', { insumo_id, tipo }),
  getProveedores: () => request('GET', '/api/proveedores'),
  addProveedor: (data) => request('POST', '/api/proveedores', data),
  updateProveedor: (id, data) => request('PUT', `/api/proveedores/${id}`, data),
  deleteProveedor: (id) => request('DELETE', `/api/proveedores/${id}`),
}
