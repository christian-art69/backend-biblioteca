import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js'; // Importa el middleware de token
import { isAdmin } from '../middlewares/adminMiddleware.js';     // Importa el middleware de Admin

// Importamos todas las funciones del controlador como un objeto
import * as libroController from '../controllers/libro.controller.js'; // ¡Añade .js!

const router = express.Router();

// --- Rutas ---

// GET /api/libros (Ver libros)
// Requisito: "acceso para todos los usuarios" (logueados)
router.get('/', verifyToken, libroController.getLibros);

// POST /api/libros (Crear libro)
// Requisito: "acceso solo para administradores"
router.post('/', [verifyToken, isAdmin], libroController.createLibro);

// PUT /api/libros/:id (Actualizar libro)
// Requisito: "acceso solo para administradores"
router.put('/:id', [verifyToken, isAdmin], libroController.updateLibro);

// DELETE /api/libros/:id (Eliminar libro)
// Requisito: "acceso solo para administradores"
router.delete('/:id', [verifyToken, isAdmin], libroController.deleteLibro);


export default router; // Exportación por defecto