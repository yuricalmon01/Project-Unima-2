// ============================================
// API REST SISTEMA DE SAÚDE UNIMA
// Node.js + Express + MySQL
// ============================================

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// Segurança
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP por janela de tempo
});
app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido'));
        }
    }
});

// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unima_health_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// ============================================
// MIDDLEWARES DE AUTENTICAÇÃO
// ============================================

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unima_secret_key');
        req.user = decoded;
        
        // Definir usuário atual para triggers de auditoria
        await pool.execute('SET @current_user_id = ?', [decoded.id]);
        
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido' });
    }
};

const authorize = (userTypes) => {
    return (req, res, next) => {
        if (!userTypes.includes(req.user.userType)) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        next();
    };
};

// ============================================
// ROUTES DE AUTENTICAÇÃO
// ============================================

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password são obrigatórios' });
        }

        const [users] = await pool.execute(`
            SELECT u.*, ut.name as user_type_name 
            FROM users u 
            JOIN user_types ut ON u.user_type_id = ut.id 
            WHERE u.username = ? AND u.active = TRUE
        `, [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Atualizar último login
        await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                userType: user.user_type_name 
            },
            process.env.JWT_SECRET || 'unima_secret_key',
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                userType: user.user_type_name
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Registro de usuário (apenas admins)
app.post('/api/auth/register', authenticateToken, authorize(['Admin']), async (req, res) => {
    try {
        const {
            username, email, password, firstName, lastName,
            cpf, phone, birthDate, gender, }