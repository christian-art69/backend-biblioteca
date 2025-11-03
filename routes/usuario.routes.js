import express from 'express';
import * as usuarioController from '../controllers/usuario.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { isAdminOrSelf } from '../middlewares/adminOrSelfMiddleware.js'; // 1. IMPORTA EL NUEVO MIDDLEWARE

const router = express.Router();

// Rutas que solo el Admin puede usar
router.get('/', [verifyToken, isAdmin], usuarioController.getUsuarios);
router.post('/', [verifyToken, isAdmin], usuarioController.createUsuario);
router.delete('/:id', [verifyToken, isAdmin], usuarioController.deleteUsuario);

// Rutas que el Admin O el propio usuario pueden usar
router.get('/:id', [verifyToken, isAdminOrSelf], usuarioController.getUsuarioById); // 2. USA EL NUEVO MIDDLEWARE
router.put('/:id', [verifyToken, isAdminOrSelf], usuarioController.updateUsuario); // 3. USA EL NUEVO MIDDLEWARE AQUÍ TAMBIÉN

export default router;