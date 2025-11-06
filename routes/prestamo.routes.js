import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

import {
  createPrestamo,
  devolverPrestamo,
  getAllPrestamos,
  getMisPrestamos,
  getPrestamosPorUsuario,
  getHistorialTodos,
  getHistorialPorUsuario
} from '../controllers/prestamo.controller.js'; 

const router = express.Router();

router.post('/', [verifyToken, isAdmin], createPrestamo);
router.put('/devolver/:id', verifyToken, devolverPrestamo); 
router.get('/', [verifyToken, isAdmin], getAllPrestamos);
router.get('/mis-prestamos', verifyToken, getMisPrestamos);
router.get('/usuario/:usuarioId', [verifyToken, isAdmin], getPrestamosPorUsuario);
router.get('/historial/todos', [verifyToken, isAdmin], getHistorialTodos);
router.get('/historial/:usuarioId', verifyToken, getHistorialPorUsuario);


export default router;