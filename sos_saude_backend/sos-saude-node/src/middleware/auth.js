import { verifyToken } from '../utils/jwt.js';

// Middleware para autenticação com JWT
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Token de acesso requerido" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: "Token inválido" });
  }
};

// Middleware para autorização por tipo de usuário
export const authorize = (userTypes) => (req, res, next) => {
  if (!userTypes.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: "Acesso negado" });
  }
  next();
};

// Alias para compatibilidade
export const auth = authenticateToken;
