import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import * as libroController from '../controllers/libro.controller.js';

const router = express.Router();

router.get('/', verifyToken, libroController.getLibros);
router.post('/', [verifyToken, isAdmin], libroController.createLibro);
router.put('/:id', [verifyToken, isAdmin], libroController.updateLibro);
router.delete('/:id', [verifyToken, isAdmin], libroController.deleteLibro);
router.get('/buscar/:titulo', verifyToken, libroController.buscarLibrosPorTitulo);


export default router;