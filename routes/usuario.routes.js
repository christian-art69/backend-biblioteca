import express from 'express';
// Importamos con sintaxis ESM y el nombre correcto del archivo (.js)
import * as usuarioController from '../controllers/usuario.js';

const router = express.Router();

router.get('/', usuarioController.getUsuarios);
router.post('/', usuarioController.createUsuario);
router.get('/:id', usuarioController.getUsuarioById);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

// Exportamos con sintaxis ESM
export default router;