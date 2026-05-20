export function sendJSON(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(body)
}

export function sendSuccess(res, { data = null, message = 'OK', statusCode = 200 } = {}) {
  sendJSON(res, statusCode, { success: true, message, data })
}

export function sendError(res, { message = 'Error interno del servidor', statusCode = 500, errors = null } = {}) {
  const response = { success: false, message, data: null }
  if (errors) response.errors = errors
  sendJSON(res, statusCode, response)
}
