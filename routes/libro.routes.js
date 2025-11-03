import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import * as libroController from '../controllers/libro.controller.js'; // ¡Con .js!

const router = express.Router();
router.get('/', verifyToken, libroController.getLibros);
router.post('/', [verifyToken, isAdmin], libroController.createLibro);
router.put('/:id', [verifyToken, isAdmin], libroController.updateLibro);
router.delete('/:id', [verifyToken, isAdmin], libroController.deleteLibro);


export default router;