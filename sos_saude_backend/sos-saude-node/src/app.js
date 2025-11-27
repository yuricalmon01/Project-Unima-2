// ============================================
// S.O.S SAÚDE BACKEND - NODE.JS + EXPRESS
// Estrutura Modular e Segura
// ============================================

import "dotenv/config";

// Validacoes basicas para ambiente de producao
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'unima_secret_key') {
    throw new Error('❌ JWT_SECRET não configurado ou inválido para produção');
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('❌ JWT_REFRESH_SECRET não configurado para produção');
  }
  if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'root') {
    throw new Error('❌ DB_PASSWORD não deve usar credenciais padrão em produção');
  }
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Middlewares e autenticação
import { authenticateToken } from "./middleware/auth.js";

// Rotas principais
import authRoutes from "./routes/authRoutes.js";
import pacientesRoutes from "./routes/pacientesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();

// ============================================
// CORS - Permitir acesso do frontend
// ============================================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3001", // Frontend local (Next.js)
      "http://localhost:3000", // Frontend local (alternativo)
      "https://front-sos-saude.example.com", // Seu domínio de produção - ALTERAR
      "https://*.vercel.app", // Vercel deployment
      "https://amplify.console.aws.amazon.com", // AWS Amplify
    ];

    // Permite requests sem origin (como aplicações mobile ou servidor-para-servidor)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.some(o => {
      if (o.includes("*")) {
        const regex = new RegExp(o.replace(/\*/g, ".*"));
        return regex.test(origin);
      }
      return o === origin;
    })) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origin: ${origin}`);
      callback(new Error("Não permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ============================================
// Segurança e Middleware Global
// ============================================
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Limite de requisições (ajustável por ambiente)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 50 : 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ============================================
// Rotas Públicas
// ============================================
app.use("/api/auth", authRoutes);

// ============================================
// Rotas Protegidas (com JWT)
// ============================================
app.use("/api/pacientes", authenticateToken, pacientesRoutes);
app.use("/api/users", authenticateToken, usersRoutes);

// ============================================
// Healthcheck
// ============================================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API SOS Saúde OK" });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "API SOS Saúde OK", version: "1.0.0" });
});

// ============================================
// Erro 404
// ============================================
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Rota não encontrada" });
});

// ============================================
// Inicialização
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 CORS ativado para: ${process.env.ALLOWED_ORIGINS || "localhost"}`);
  console.log(`🗄️  Banco de dados: ${process.env.DB_HOST || "localhost"}`);
});

export default app;
