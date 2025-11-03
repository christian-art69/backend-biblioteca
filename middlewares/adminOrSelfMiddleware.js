export const isAdminOrSelf = (req, res, next) => {

  if (req.user.rol === 'Admin' || req.user.id === req.params.id) {
   
    next();
  } else {

    return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso.' });
}
};