import { read } from '../db/database.js'
import { sendSuccess } from '../utils/response.js'

const recetasDB = [
  {
    titulo: 'Creamy Tomato Risotto',
    descripcion: 'A weeknight risotto that uses arborio, milk and tomatoes you already have on the shelf.',
    tiempo: '35 min',
    porciones: 4,
    ingredientes: ['Arborio rice, 2lb', 'Roma tomatoes', 'Whole milk, 1 gal', 'Aged parmesan', 'Garlic bulbs', 'Yellow onion'],
    instrucciones: '1. Sauté garlic and onion in olive oil.\n2. Add arborio rice and toast for 2 min.\n3. Slowly add warm milk, stirring constantly.\n4. Add chopped tomatoes and parmesan.\n5. Simmer until creamy. Season and serve.',
  },
  {
    titulo: 'Pan-seared Salmon, Spinach Salad',
    descripcion: 'Quick high-protein dinner that clears two of the items closest to expiry.',
    tiempo: '20 min',
    porciones: 2,
    ingredientes: ['Atlantic salmon', 'Baby spinach', 'Olive oil, 1L', 'Garlic bulbs', 'Lemon'],
    instrucciones: '1. Season salmon with salt and pepper.\n2. Sear in olive oil 4 min per side.\n3. Sauté garlic and spinach in the same pan.\n4. Serve salmon over spinach, squeeze lemon on top.',
  },
  {
    titulo: 'Sourdough Panzanella',
    descripcion: 'A no-cook salad that rescues day-old sourdough and the last of the tomatoes.',
    tiempo: '15 min',
    porciones: 4,
    ingredientes: ['Sourdough loaf', 'Roma tomatoes', 'Olive oil, 1L', 'Aged parmesan', 'Red onion', 'Basil'],
    instrucciones: '1. Tear sourdough into bite-sized pieces.\n2. Chop tomatoes and red onion.\n3. Mix everything with olive oil and vinegar.\n4. Let sit 10 min. Top with parmesan and basil.',
  },
]

export function recetasRoutes(req, res, body, pathname, usuarioId) {
  if (pathname === '/api/recetas' && req.method === 'POST') {
    const insumos = read('insumos').filter(i => i.usuario_id === usuarioId && i.estado === 'activo')

    if (insumos.length === 0) {
      return sendSuccess(res, { data: { recetas: [], mensaje: 'No hay ingredientes disponibles. Agrega productos a tu inventario.' } })
    }

    const enriched = recetasDB.map(receta => {
      const coincidencias = receta.ingredientes.filter(ing => {
        const nombreIng = ing.toLowerCase().split(',')[0].trim()
        return insumos.some(i => i.nombre.toLowerCase().includes(nombreIng) || nombreIng.includes(i.nombre.toLowerCase().split(',')[0].trim()))
      })
      return {
        ...receta,
        ingredientes_necesarios: receta.ingredientes,
        ingredientes_disponibles: coincidencias.length,
        en_stock: receta.ingredientes.map(ing => ({
          nombre: ing,
          disponible: insumos.some(i => ing.toLowerCase().split(',')[0].trim() === i.nombre.toLowerCase().split(',')[0].trim() ||
            i.nombre.toLowerCase().split(',')[0].trim() === ing.toLowerCase().split(',')[0].trim()),
        })),
      }
    }).filter(r => r.ingredientes_disponibles > 0)

    return sendSuccess(res, { data: { recetas: enriched.slice(0, 3) } })
  }

  return false
}
