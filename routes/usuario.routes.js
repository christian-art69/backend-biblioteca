import express from 'express';
import * as usuarioController from '../controllers/usuario.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();
router.get('/', [verifyToken, isAdmin], usuarioController.getUsuarios);
router.post('/', [verifyToken, isAdmin], usuarioController.createUsuario);
router.get('/:id', [verifyToken, isAdmin], usuarioController.getUsuarioById);
router.put('/:id', [verifyToken, isAdmin], usuarioController.updateUsuario);
router.delete('/:id', [verifyToken, isAdmin], usuarioController.deleteUsuario);

export default router;