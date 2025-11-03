import Libro from '../models/libro.model.js';

export const getLibros = async (req, res) => {
  try {
    const { search } = req.query;
    let filtro = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filtro = {
        $or: [
          { titulo: regex },
          { autor: regex },
          { categoria: regex }
        ]
      };
    }

    const libros = await Libro.find(filtro);
    res.json(libros);
  } catch (error) {

    console.error('Error al obtener los libros:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getLibroById = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(libro);
  } catch (error) {
    console.error('Error al obtener el libro:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createLibro = async (req, res) => {
  try {
    const nuevoLibro = new Libro(req.body);
    const libroGuardado = await nuevoLibro.save();
    res.status(201).json(libroGuardado);
  } catch (error) {

    console.error('Error al crear el libro:', error.message);
    res.status(400).json({ message: 'Error al crear el libro, verifique los datos' });
  }
};

export const updateLibro = async (req, res) => {
  try {
    const libroActualizado = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!libroActualizado) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(libroActualizado);
  } catch (error) {
    console.error('Error al actualizar el libro:', error.message);
    res.status(400).json({ message: 'Error al actualizar el libro, verifique los datos' });
  }
};

export const deleteLibro = async (req, res) => {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);
    if (!libroEliminado) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el libro:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};