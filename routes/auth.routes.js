const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @ruta    POST api/auth/register
// @desc    Registrar un nuevo usuario
// @acceso  Público
router.post('/register', authController.register);

// @ruta    POST api/auth/login
// @desc    Iniciar sesión (autenticar) y obtener token
// @acceso  Público
router.post('/login', authController.login);

module.exports = router;