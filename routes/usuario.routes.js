// routes/usuario.routes.js (Corregido)
import express from 'express';
import * as usuarioController from '../controllers/usuario.js';

// ¡Importamos los middlewares!
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Protegemos todas las rutas con verifyToken e isAdmin
// Estas rutas ahora solo serán accesibles por administradores logueados.
router.get('/', [verifyToken, isAdmin], usuarioController.getUsuarios);
router.post('/', [verifyToken, isAdmin], usuarioController.createUsuario);
router.get('/:id', [verifyToken, isAdmin], usuarioController.getUsuarioById);
router.put('/:id', [verifyToken, isAdmin], usuarioController.updateUsuario);
router.delete('/:id', [verifyToken, isAdmin], usuarioController.deleteUsuario);

export default router;