import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

import {
  createPrestamo,
  devolverPrestamo,
  getAllPrestamos,
  getMisPrestamos
} from '../controllers/prestamo.controller.js'; // ¡Con .js!

const router = express.Router();

// --- Rutas de Admin ---

// POST /api/prestamos (Crear un préstamo)
router.post('/', [verifyToken, isAdmin], createPrestamo);

// PUT /api/prestamos/:id/devolver (Marcar un préstamo como devuelto)
router.put('/:id/devolver', [verifyToken, isAdmin], devolverPrestamo);

// GET /api/prestamos (Ver TODOS los préstamos)
router.get('/', [verifyToken, isAdmin], getAllPrestamos);

// --- Rutas de Usuario (Estudiante) ---

// GET /api/prestamos/mis-prestamos (Ver solo mis préstamos)
router.get('/mis-prestamos', verifyToken, getMisPrestamos);


export default router;