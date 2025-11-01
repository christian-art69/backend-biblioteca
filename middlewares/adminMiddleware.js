import Usuario from '../models/usuario.model.js'; // Importamos el modelo

/**
 * Verifica si el usuario autenticado (adjunto en req.user por verifyToken)
 * tiene el rol de 'Admin'.
 * DEBE usarse después de verifyToken.
 */
export const isAdmin = async (req, res, next) => {
  // req.user debería existir gracias al middleware verifyToken
  if (!req.user || !req.user.id) {
    return res.status(500).json({ message: 'Error: El middleware isAdmin debe usarse después de verifyToken.' });
  }

  try {
    // Buscamos al usuario en la BD por el ID que estaba en el token
    const usuario = await Usuario.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ message: 'El usuario asociado a este token ya no existe.' });
    }

    // Comprobamos el rol
    if (usuario.rol !== 'Admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' });
    }

    // El usuario es Admin, puede continuar
    next();

  } catch (error) {
    console.error('Error en middleware isAdmin:', error);
    res.status(500).json({ message: 'Error interno al verificar permisos de administrador.' });
  }
};