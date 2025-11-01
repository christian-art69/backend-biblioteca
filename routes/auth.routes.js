    import express from 'express';
    // Importa las funciones específicas del controlador
    import { register, login } from '../controllers/authController.js'; // ¡Con .js!

    const router = express.Router();

    // @ruta    POST api/auth/register
    router.post('/register', register);

    // @ruta    POST api/auth/login
    router.post('/login', login);

    export default router;