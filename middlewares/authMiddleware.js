import jwt from 'jsonwebtoken';

/**
 * Verifica el token JWT presente en la cabecera 'Authorization'.
 * Si es válido, adjunta el payload del token (usuario) a req.user.
 */
export const verifyToken = (req, res, next) => {
  // Obtenemos el token de la cabecera. Formato esperado: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No hay token, acceso denegado
    return res.status(403).json({ message: 'Acceso denegado. Se requiere un token.' });
  }

  try {
    // Verificamos el token usando la clave secreta
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntamos el payload (que tiene id y rol) al objeto request
    req.user = payload; 
    
    // Continuamos a la siguiente función (middleware o controlador)
    next();

  } catch (error) {
    console.error('Error al verificar token:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado. Por favor, inicie sesión de nuevo.' });
    }
    // Token no válido por otra razón
    return res.status(401).json({ message: 'Token no válido.' });
  }
};