const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Rotas existentes
const authRoutes = require("./routes/authRoutes");

// 🆕 Novas rotas
const triageRoutes = require("./routes/triageRoutes");

// 🆕 Middleware de autenticação
const { auth } = require("./middleware/auth");

const app = express();

// Segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

// Limite de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

// Rotas de autenticação
app.use("/api/auth", authRoutes);

//  Rotas de triagem (com proteção JWT)
app.use("/api/triage", auth, triageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
