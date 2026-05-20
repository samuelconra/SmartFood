export function validate(schema, body) {
  const errors = []
  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field]
    for (const rule of rules) {
      const error = rule(value, field)
      if (error) {
        errors.push({ field, message: error })
        break
      }
    }
  }
  return errors.length > 0 ? errors : null
}

export const required = (msg) => (v, field) =>
  v === undefined || v === null || v === '' ? msg || `${field} es requerido` : null

export const isEmail = (msg) => (v, field) =>
  v && !/^\S+@\S+\.\S+$/.test(v) ? msg || `${field} no es un email válido` : null

export const isInt = (msg) => (v, field) =>
  v !== undefined && v !== null && v !== '' && !Number.isInteger(Number(v))
    ? msg || `${field} debe ser un número entero`
    : null

export const min = (min, msg) => (v, field) =>
  v !== undefined && v !== null && v !== '' && Number(v) < min
    ? msg || `${field} debe ser al menos ${min}`
    : null

export const maxLength = (max, msg) => (v, field) =>
  v && v.length > max ? msg || `${field} no puede superar ${max} caracteres` : null

export const oneOf = (values, msg) => (v, field) =>
  v && !values.includes(v) ? msg || `${field} debe ser uno de: ${values.join(', ')}` : null
