const jwt = require("jsonwebtoken");

// Middleware para autenticação com JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Token de acesso requerido" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "unima_secret_key"
    );
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ success: false, error: "Token inválido" });
  }
};

// Middleware para autorização por tipo de usuário
const authorize = (userTypes) => (req, res, next) => {
  if (!userTypes.includes(req.user?.userType)) {
    return res.status(403).json({ success: false, error: "Acesso negado" });
  }
  next();
};

// Alias para compatibilidade
const auth = authenticateToken;

module.exports = { authenticateToken, authorize, auth };
