// ============================================
// S.O.S SAÚDE BACKEND - NODE.JS + EXPRESS
// Estrutura Modular e Segura
// ============================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Middlewares e autenticação
const { auth } = require("./middleware/auth");

// Rotas principais
const authRoutes = require("./routes/authRoutes");
const triageRoutes = require("./routes/triageRoutes");
const appointmentsRoutes = require("./routes/appointmentsRoutes");
const doctorsRoutes = require("./routes/doctorsRoutes");
const medicalRecordsRoutes = require("./routes/medicalRecordsRoutes");
const medicinesRoutes = require("./routes/medicinesRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

// ============================================
// Segurança e Middleware Global
// ============================================
app.use(helmet());
app.use(cors());
app.use(express.json());

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
app.use("/api/triage", auth, triageRoutes);
app.use("/api/appointments", auth, appointmentsRoutes);
app.use("/api/doctors", auth, doctorsRoutes);
app.use("/api/medical-records", auth, medicalRecordsRoutes);
app.use("/api/medicines", auth, medicinesRoutes);
app.use("/api/password", auth, passwordRoutes);

// ============================================
// Healthcheck
// ============================================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ============================================
// Inicialização
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
