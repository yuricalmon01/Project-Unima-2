// ============================================
// API REST SISTEMA DE SAÚDE UNIMA
// Node.js + Express + MySQL
// ============================================

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Configuração do banco de dados
const pool = require("./config/db");

// Rotas externas
const userRoutes = require("./routes/users");
const pacienteRoutes = require("./routes/pacientes");

const app = express();
app.set("trust proxy", 1);
app.set("trust proxy", 1); // permite identificar IP real atrás do API Gateway/EB
// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

app.use(helmet());

// Configuração CORS para aceitar múltiplas origens (desenvolvimento e produção)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3001",
  "http://localhost:3001", // Desenvolvimento local
];

// Adiciona URL do Amplify se configurada
if (process.env.AMPLIFY_URL) {
  allowedOrigins.push(process.env.AMPLIFY_URL);
}

// Permite qualquer subdomínio do Amplify (ex: main.d1234567890.amplifyapp.com)
const amplifyPattern = /^https:\/\/.*\.amplifyapp\.com$/;
if (process.env.NODE_ENV === "production") {
  // Em produção, aceita qualquer URL do Amplify
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permite requisições sem origin (ex: Postman, mobile apps)
        if (!origin) return callback(null, true);

        // Verifica se está na lista de origens permitidas
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Verifica se é um domínio do Amplify
        if (amplifyPattern.test(origin)) {
          return callback(null, true);
        }

        callback(new Error("Não permitido por CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
} else {
  // Em desenvolvimento, aceita apenas origens configuradas
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
}

// Limita 100 requisições a cada 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

// Parsing do corpo das requisições
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROTAS DE AUTENTICAÇÃO
// ============================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username e password são obrigatórios" });

    const [users] = await pool.execute(
      `
      SELECT u.*, ut.name as user_type_name 
      FROM users u 
      JOIN user_types ut ON u.user_type_id = ut.id 
      WHERE u.username = ? AND u.active = TRUE
      `,
      [username]
    );

    if (users.length === 0)
      return res.status(401).json({ error: "Credenciais inválidas" });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ error: "Credenciais inválidas" });

    await pool.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    const token = jwt.sign(
      { id: user.id, username: user.username, userType: user.user_type_name },
      process.env.JWT_SECRET || "unima_secret_key",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        userType: user.user_type_name,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      cpf,
      phone,
      birthDate,
      gender,
      userTypeId,
    } = req.body;

    if (!username || !email || !password || !firstName || !lastName)
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      `
      INSERT INTO users (
        user_type_id, username, email, password_hash,
        first_name, last_name, cpf, phone, birth_date, gender
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userTypeId || 5, // padrão: paciente
        username,
        email,
        hashedPassword,
        firstName,
        lastName,
        cpf || null,
        phone || null,
        birthDate || null,
        gender || null,
      ]
    );

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ============================================
// ROTAS EXTERNAS
// ============================================

app.use("/api/users", userRoutes);
app.use("/api/pacientes", pacienteRoutes);
const appointmentsRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentsRoutes);

// ============================================
// HEALTHCHECK (pra teste e monitoramento)
// ============================================

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Exporta o app pra ser usado no index.js e nos testes
module.exports = app;
