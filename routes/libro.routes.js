import express from 'express';
// Importa los middlewares
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

// Importa todas las funciones del controlador
import * as libroController from '../controllers/libro.controller.js'; // ¡Con .js!

const router = express.Router();

// --- Rutas ---

// GET /api/libros (Cualquier usuario logueado)
router.get('/', verifyToken, libroController.getLibros);

// POST /api/libros (Solo Admin)
router.post('/', [verifyToken, isAdmin], libroController.createLibro);

// PUT /api/libros/:id (Solo Admin)
router.put('/:id', [verifyToken, isAdmin], libroController.updateLibro);

// DELETE /api/libros/:id (Solo Admin)
router.delete('/:id', [verifyToken, isAdmin], libroController.deleteLibro);


export default router;