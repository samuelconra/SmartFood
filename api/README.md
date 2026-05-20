# 🥗 SmartFood API

API REST production-ready para la gestión de inventario inteligente de alimentos.  
**Stack:** Node.js · Express · Mongoose · MongoDB Atlas

---

## 📁 Estructura del proyecto

```
smartfood-api/
├── src/
│   ├── server.js                  # Entry point — Express + CORS + middlewares
│   ├── config/
│   │   └── database.js            # Conexión a MongoDB con reconexión automática
│   ├── models/                    # Schemas Mongoose tipados y validados
│   │   ├── Proveedor.js
│   │   ├── Usuario.js
│   │   ├── ProductoCatalogo.js
│   │   ├── InventarioLote.js
│   │   ├── HistorialMovimiento.js
│   │   └── Receta.js
│   ├── services/                  # Lógica de negocio y queries a MongoDB
│   │   ├── proveedores.service.js
│   │   ├── usuarios.service.js
│   │   ├── productos.service.js
│   │   ├── inventario.service.js
│   │   ├── historial.service.js
│   │   └── recetas.service.js
│   ├── controllers/               # Controladores HTTP (factory reutilizable)
│   │   ├── crud.factory.js
│   │   ├── proveedores.controller.js
│   │   ├── usuarios.controller.js
│   │   ├── productos.controller.js
│   │   ├── inventario.controller.js
│   │   ├── historial.controller.js
│   │   └── recetas.controller.js
│   ├── routes/                    # Routers Express con validaciones
│   │   ├── index.js
│   │   ├── proveedores.routes.js
│   │   ├── usuarios.routes.js
│   │   ├── productos.routes.js
│   │   ├── inventario.routes.js
│   │   ├── historial.routes.js
│   │   └── recetas.routes.js
│   ├── middlewares/
│   │   ├── errorHandler.js        # Manejo centralizado de errores + 404
│   │   └── validators.js          # Reglas express-validator por recurso
│   └── utils/
│       └── response.js            # Helpers: sendSuccess, sendError, paginación
├── .env                           # Variables de entorno (NO commitear)
├── .env.example                   # Plantilla de variables
├── .gitignore
└── package.json
```

---

## ⚡ Instalación y arranque

### 1. Requisitos previos
- Node.js ≥ 18
- npm ≥ 9
- IP whitelisteada en MongoDB Atlas (o `0.0.0.0/0` en dev)

### 2. Instalar dependencias
```bash
cd smartfood-api
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tu cadena de conexión si es diferente
```

El `.env` ya viene preconfigurado con la URI de tu cluster:
```env
MONGODB_URI=mongodb+srv://darianahernandez0406_db_user:montse123@smartfood1.q4k1hai.mongodb.net/inventario?retryWrites=true&w=majority
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=3000
```

### 4. Correr el servidor
```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

La API queda disponible en: `http://localhost:3000/api/v1`

---

## 📡 Endpoints

### Health check
```
GET /api/v1/health
```

### 🏭 Proveedores  `/api/v1/proveedores`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/proveedores` | Listar — filtros: `?nombre=` |
| GET | `/proveedores/:id` | Detalle |
| POST | `/proveedores` | Crear |
| PUT | `/proveedores/:id` | Actualizar |
| DELETE | `/proveedores/:id` | Eliminar |

### 👤 Usuarios  `/api/v1/usuarios`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/usuarios` | Listar — filtros: `?tipo=hogar\|local&nombre=` |
| GET | `/usuarios/:id` | Detalle |
| POST | `/usuarios` | Crear |
| PUT | `/usuarios/:id` | Actualizar |
| DELETE | `/usuarios/:id` | Eliminar |

### 🛒 Productos catálogo  `/api/v1/productos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos` | Listar — filtros: `?categoria=&proveedor_ref=&nombre=&precioMin=&precioMax=` |
| GET | `/productos/:id` | Detalle (populate proveedor) |
| POST | `/productos` | Crear |
| PUT | `/productos/:id` | Actualizar |
| DELETE | `/productos/:id` | Eliminar |

### 📦 Inventario lotes  `/api/v1/inventario`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/inventario` | Listar — filtros: `?usuario_ref=&producto_ref=&diasParaVencer=7&bajoBumbral=true` |
| GET | `/inventario/:id` | Detalle (populate usuario + producto + proveedor) |
| POST | `/inventario` | Registrar lote |
| PUT | `/inventario/:id` | Actualizar lote |
| DELETE | `/inventario/:id` | Eliminar lote |

### 📊 Historial movimientos  `/api/v1/historial`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/historial` | Listar — filtros: `?usuario_ref=&accion=consumido\|desperdiciado\|donado\|comprado\|ajuste&fechaDesde=&fechaHasta=` |
| GET | `/historial/:id` | Detalle |
| GET | `/historial/resumen/:usuarioId` | 📈 Resumen estadístico por acción |
| POST | `/historial` | Registrar movimiento |
| PUT | `/historial/:id` | Actualizar |
| DELETE | `/historial/:id` | Eliminar |

### 🍳 Recetas  `/api/v1/recetas`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/recetas` | Listar — filtros: `?usuario_ref=&nombre=&tiempoMax=30&producto_ref=` |
| GET | `/recetas/:id` | Detalle (populate usuario + ingredientes) |
| POST | `/recetas` | Crear receta |
| PUT | `/recetas/:id` | Actualizar |
| DELETE | `/recetas/:id` | Eliminar |

---

## 🔍 Paginación, filtros y ordenamiento

Todos los endpoints de listado soportan:

```
GET /api/v1/inventario?page=2&limit=20&sort=-fechaCaducidad
```

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `page` | Número de página (default: 1) | `?page=2` |
| `limit` | Resultados por página (max: 100, default: 10) | `?limit=25` |
| `sort` | Campo a ordenar. Prefijo `-` para descendente | `?sort=-fecha` |

### Formato de respuesta
```json
{
  "success": true,
  "message": "Lotes obtenidos correctamente",
  "data": [...],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 🔗 Relaciones entre colecciones

```
Proveedor  ←──  ProductoCatalogo  ←──  InventarioLote   ──→  Usuario
                      │                                         │
                      └──────────────  Receta  ────────────────┘
                                       (ingredientes[])
                      ←──  HistorialMovimiento  ──→  Usuario
```

---

## 🗂️ Ejemplo: Crear un lote de inventario

```bash
curl -X POST http://localhost:3000/api/v1/inventario \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_ref": "66c1d2e3f4a5b6c7d8e9f001",
    "producto_ref": "66c1d2e3f4a5b6c7d8e9f201",
    "cantidad": 3,
    "unidadMedida": "litros",
    "fechaCaducidad": "2025-08-01",
    "umbralMinimo": 0.5
  }'
```

## 🗂️ Ejemplo: Lotes próximos a vencer en 3 días

```bash
curl "http://localhost:3000/api/v1/inventario?diasParaVencer=3&sort=fechaCaducidad"
```

## 🗂️ Ejemplo: Resumen de desperdicio de un usuario

```bash
curl "http://localhost:3000/api/v1/historial/resumen/66c1d2e3f4a5b6c7d8e9f001"
```

---

## 🔒 Notas de seguridad para producción

1. **Whitelist de IPs en Atlas** — agrega la IP de tu servidor en MongoDB Atlas → Network Access.
2. **Rotar credenciales** — cambia la contraseña del usuario de BD antes de ir a producción.
3. **Variables de entorno** — nunca commitees `.env`. Usa los secrets de tu plataforma (Railway, Render, etc.).
4. **Rate limiting** — instala `express-rate-limit` para APIs públicas.
5. **JWT** — agrega autenticación con `jsonwebtoken` si la API será pública.
