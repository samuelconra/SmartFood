import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '..', '..', '.env')

let SECRET
function getSecret() {
  if (SECRET) return SECRET
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf-8')
    const match = env.match(/JWT_SECRET=(.+)/)
    if (match) {
      SECRET = match[1].trim()
      return SECRET
    }
  }
  SECRET = crypto.randomBytes(32).toString('hex')
  return SECRET
}

const TOKEN_EXPIRY = 24 * 60 * 60 * 1000

export function createToken(payload) {
  const secret = getSecret()
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + TOKEN_EXPIRY })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

export function verifyToken(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const secret = getSecret()
    const sig = crypto.createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url')
    if (sig !== parts[2]) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const computed = crypto.scryptSync(password, salt, 64).toString('hex')
  return computed === hash
}
