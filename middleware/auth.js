const jwt = require("jsonwebtoken");

// Middleware para autenticação com JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de acesso requerido" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "unima_secret_key"
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

// Middleware para autorização por tipo de usuário
const authorize = (userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorize };
