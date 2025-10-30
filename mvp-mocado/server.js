import express from "express";
import jwt from "jsonwebtoken";
import { users, pacientes } from "./mockData.js";

const app = express();
app.use(express.json());
const JWT_SECRET = "segredo_super_secreto";

// 🔐 Login (gera token)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware pra autenticar
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token ausente" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Token inválido" });
  }
}

// 🧠 Listar pacientes
app.get("/api/pacientes", autenticar, (req, res) => {
  res.json(pacientes);
});

// ➕ Cadastrar paciente
app.post("/api/pacientes", autenticar, (req, res) => {
  const { nome, idade, sintomas } = req.body;

  const risco =
    sintomas.includes("dor no peito") || sintomas.includes("falta de ar")
      ? "Alta"
      : sintomas.includes("febre")
      ? "Média"
      : "Baixa";

  const novo = { id: pacientes.length + 1, nome, idade, sintomas, risco };
  pacientes.push(novo);
  res.status(201).json(novo);
});

app.listen(3000, () => console.log("🚀 Servidor mocado rodando em http://localhost:3000"));
   