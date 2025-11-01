import Usuario from '../models/usuario.model.js'; // ¡Con .js!
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Registrar un nuevo usuario ---
export const register = async (req, res) => {
  try {
    const { nombre, correo, password, rut, cargo, rol } = req.body;

    let usuario = await Usuario.findOne({ $or: [{ correo }, { rut }] });
    if (usuario) {
      return res.status(400).json({ message: 'El correo o RUT ya está registrado' });
    }

    usuario = new Usuario({
      nombre,
      correo,
      password, // El modelo 'pre-save' la hashea
      rut,
      cargo,
      rol
    });

    await usuario.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// --- Iniciar Sesión (Login) ---
export const login = async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    const usuario = await Usuario.findOne({
      $or: [
        { correo: loginIdentifier },
        { nombre: loginIdentifier },
        { rut: loginIdentifier }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario, correo o RUT no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    if (usuario.situacion === 'Bloqueado') {
      return res.status(403).json({ message: 'Usuario bloqueado. Contacte a la biblioteca.' });
    }

    const payload = {
      id: usuario._id,
      rol: usuario.rol // Usamos el 'rol' ('Admin' o 'Usuario')
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};