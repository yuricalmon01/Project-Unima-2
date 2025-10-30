import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change_me_secret';
const EXP = process.env.JWT_EXP || '1d';

export function signToken(payload){ return jwt.sign(payload, SECRET, { expiresIn: EXP }); }
export function verifyToken(token){ return jwt.verify(token, SECRET); }
