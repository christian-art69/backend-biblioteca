const Usuario = require('../models/usuario.model'); // Tu modelo actualizado
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Registrar un nuevo usuario ---
exports.register = async (req, res) => {
  try {
    // Obtenemos todos los campos de tu nuevo modelo
    const { nombre, correo, password, rut, cargo, rol } = req.body;

    // 1. Verificar si el correo o el rut ya existen
    let usuario = await Usuario.findOne({ $or: [{ correo }, { rut }] });
    if (usuario) {
      return res.status(400).json({ message: 'El correo o RUT ya está registrado' });
    }

    // 2. Crear el nuevo usuario
    usuario = new Usuario({
      nombre,
      correo,
      password, // En texto plano, el modelo lo hashea
      rut,
      cargo,    // 'Estudiante', 'Docente', 'Bibliotecario'
      rol       // 'Admin' o 'Usuario' (si no se envía, es 'Usuario')
    });

    // 3. Guardar en MongoDB
    // (El middleware 'pre-save' en tu modelo hashea la contraseña)
    await usuario.save();

    // 4. Enviar respuesta exitosa
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    // Manejo de errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// --- Iniciar Sesión (Login) ---
// (Tu código de login estaba perfecto y funciona con este modelo)
exports.login = async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    // Buscamos por correo, nombre o rut
    const usuario = await Usuario.findOne({
      $or: [
        { correo: loginIdentifier },
        { nombre: loginIdentifier },
        { rut: loginIdentifier } // Añadí RUT al login, ¡muy útil!
      ]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario, correo o RUT no encontrado' });
    }

    // 1. Comparamos la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // 2. (Opcional pero recomendado) Verificar si el usuario está bloqueado
    if (usuario.situacion === 'Bloqueado') {
      return res.status(403).json({ message: 'Usuario bloqueado. Contacte a la biblioteca.' });
    }

    // 3. Creamos el payload para el token
    const payload = {
      id: usuario._id,
      rol: usuario.rol // Enviamos el ROL ('Admin' o 'Usuario')
    };

    // 4. Firmamos el token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // 1 día de expiración
    );
    
    // 5. Enviamos el token al cliente
    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};