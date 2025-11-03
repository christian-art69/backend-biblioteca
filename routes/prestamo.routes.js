import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

import {
  createPrestamo,
  devolverPrestamo,
  getAllPrestamos,
  getMisPrestamos
} from '../controllers/prestamo.controller.js'; 

const router = express.Router();

router.post('/', [verifyToken, isAdmin], createPrestamo);
router.put('/:id/devolver', [verifyToken, isAdmin], devolverPrestamo);
router.get('/', [verifyToken, isAdmin], getAllPrestamos);
router.get('/mis-prestamos', verifyToken, getMisPrestamos);


export default router;