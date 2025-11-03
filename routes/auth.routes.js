    import express from 'express';
    // Importa las funciones específicas del controlador
   import { register, login } from '../controllers/auth.controller.js';

    const router = express.Router();
    router.post('/register', register);
    router.post('/login', login);

    export default router;