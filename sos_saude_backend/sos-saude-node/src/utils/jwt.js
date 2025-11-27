import jwt from 'jsonwebtoken';

// Em produção, exija que os secrets estejam definidos
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET must be set in production');
  }
}

const SECRET = process.env.JWT_SECRET || generateDevSecret('access');
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || generateDevSecret('refresh');
const TOKEN_EXP = process.env.JWT_EXP || '1h';
const REFRESH_EXP = process.env.JWT_REFRESH_EXP || '7d';

function generateDevSecret(kind) {
  return `dev-${kind}-secret-${Math.random().toString(36).slice(2)}`;
}

export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXP });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
