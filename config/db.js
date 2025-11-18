// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// Suporta modo MOCK para desenvolvimento
// ============================================

const USE_MOCK = process.env.USE_MOCK === "true" || process.env.USE_MOCK === "1";

let pool;

if (USE_MOCK) {
  // Modo MOCK - usa dados em memória
  const { MockDB } = require("../mockdata");
  const mockDB = new MockDB();
  
  // Cria um objeto que simula o pool do mysql2
  pool = {
    execute: mockDB.execute.bind(mockDB),
    getConnection: mockDB.getConnection.bind(mockDB),
    query: mockDB.execute.bind(mockDB),
  };
  
  console.log("🔧 Modo MOCK ativado - usando dados em memória");
} else {
  // Modo REAL - usa MySQL
  const mysql = require("mysql2/promise");
  
  pool = mysql.createPool({
    host: process.env.DB_HOST || "unima_db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "unima_health_system",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  
  console.log("🗄️  Modo REAL - conectado ao MySQL");
}

module.exports = pool;

