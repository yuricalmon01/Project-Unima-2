// ============================================
// S.O.S SAÚDE BACKEND - NODE.JS + EXPRESS
// Estrutura Modular e Segura
// ============================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Middlewares e autenticação
const { authenticateToken } = require("./middleware/auth");

// Rotas principais
const authRoutes = require("./routes/authRoutes");
// const triageRoutes = require("./routes/triageRoutes");
// const appointmentsRoutes = require("./routes/appointmentsRoutes");
// const doctorsRoutes = require("./routes/doctorsRoutes");
// const medicalRecordsRoutes = require("./routes/medicalRecordsRoutes");
// const medicinesRoutes = require("./routes/medicinesRoutes");
// const passwordRoutes = require("./routes/passwordRoutes");
const pacientesRoutes = require("./routes/pacientesRoutes");
const usersRoutes = require("./routes/usersRoutes");

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

// Limite de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

// ============================================
// Rotas Públicas
// ============================================
app.use("/api/auth", authRoutes);

// ============================================
// Rotas Protegidas (com JWT)
// ============================================
// app.use("/api/triage", authenticateToken, triageRoutes);
// app.use("/api/appointments", authenticateToken, appointmentsRoutes);
// app.use("/api/doctors", authenticateToken, doctorsRoutes);
// app.use("/api/medical-records", authenticateToken, medicalRecordsRoutes);
// app.use("/api/medicines", authenticateToken, medicinesRoutes);
// app.use("/api/password", authenticateToken, passwordRoutes);
app.use("/api/pacientes", authenticateToken, pacientesRoutes);
app.use("/api/users", authenticateToken, usersRoutes);

// ============================================
// Healthcheck
// ============================================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
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
});

module.exports = app;
