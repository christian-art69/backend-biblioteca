import Usuario from '../models/usuario.model.js';
export const getUsuarios = async (req, res) => {
  try {
    const { search } = req.query;
    let filtro = {};
    if (search) {
      const regex = new RegExp(search, 'i');

      filtro = {
        $or: [
          { nombre: regex },
          { rut: regex }
        ]
      };
    }
    const usuarios = await Usuario.find(filtro);
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    console.error('Error al crear el usuario:', error.message);
    res.status(400).json({ message: 'Error al crear el usuario, verifique los datos' });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { password, ...otrosDatos } = req.body;

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    Object.assign(usuario, otrosDatos);

    if (password && password.length > 0) {
      usuario.password = password; // Esto activará el pre-save hook para hashear
    }

    const usuarioActualizado = await usuario.save();
    res.json(usuarioActualizado);

  } catch (error) {
    // Mantenemos el status 400 (Bad Request) pero ocultamos el error
    console.error('Error al actualizar el usuario:', error.message);
    res.status(400).json({ message: 'Error al actualizar el usuario, verifique los datos' });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
     if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    usuario.password = undefined;
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};