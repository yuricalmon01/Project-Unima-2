// src/routes/authRoutes.js

import express from "express";
import * as authController from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Login: POST /api/auth/login
router.post("/login", authController.login);

// Dados do usuário autenticado: GET /api/auth/me
router.get("/me", auth, authController.getMe);

// Refresh token: POST /api/auth/refresh
router.post("/refresh", authController.refresh);

export default router;
