import { read, write, nextId, copyDefaultsForUser } from '../db/database.js'
import { createToken, hashPassword, verifyPassword } from '../middleware/auth.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { validate, required, isEmail } from '../utils/validators.js'

export function authRoutes(req, res, body, pathname) {
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const errors = validate({
      nombre: [required('El nombre es requerido')],
      email: [required('El email es requerido'), isEmail()],
      password: [required('La contraseña es requerida')],
    }, body)
    if (errors) return sendError(res, { message: 'Error de validación', statusCode: 400, errors })

    const { nombre, email, password } = body
    const usuarios = read('usuarios')
    if (usuarios.find(u => u.email === email)) {
      return sendError(res, { message: 'El email ya está registrado', statusCode: 400 })
    }
    const usuario = { id: nextId('usuarios'), nombre, email, password_hash: hashPassword(password), created_at: new Date().toISOString() }
    usuarios.push(usuario)
    write('usuarios', usuarios)
    copyDefaultsForUser(usuario.id)
    const token = createToken({ id: usuario.id, email: usuario.email })
    return sendSuccess(res, { data: { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } }, statusCode: 201 })
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const { email, password } = body
    if (!email || !password) {
      return sendError(res, { message: 'Email y contraseña requeridos', statusCode: 400 })
    }
    const usuarios = read('usuarios')
    const usuario = usuarios.find(u => u.email === email)
    if (!usuario || !verifyPassword(password, usuario.password_hash)) {
      return sendError(res, { message: 'Credenciales inválidas', statusCode: 401 })
    }
    const token = createToken({ id: usuario.id, email: usuario.email })
    return sendSuccess(res, { data: { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } } })
  }

  return false
}
