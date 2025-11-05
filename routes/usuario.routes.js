import express from 'express';
import * as usuarioController from '../controllers/usuario.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { isAdminOrSelf } from '../middlewares/adminOrSelfMiddleware.js';

const router = express.Router();

// Rutas que solo el Admin puede usar
router.get('/', [verifyToken, isAdmin], usuarioController.getUsuarios);
router.post('/', [verifyToken, isAdmin], usuarioController.createUsuario);
router.delete('/:id', [verifyToken, isAdmin], usuarioController.deleteUsuario);
router.get('/rut/:rut', [verifyToken, isAdmin], usuarioController.getUsuarioByRut);

// Rutas que el Admin O el propio usuario pueden usar
router.get('/:id', [verifyToken, isAdminOrSelf], usuarioController.getUsuarioById); 
router.put('/:id', [verifyToken, isAdminOrSelf], usuarioController.updateUsuario); 

export default router;