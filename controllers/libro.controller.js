import Libro from '../models/libro.model.js'; // Importa el modelo (con .js)

// GET /api/libros (con tu lógica de búsqueda)
export const getLibros = async (req, res) => {
  try {
    const { search } = req.query;
    let filtro = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // 'i' para no distinguir mayúsculas/minúsculas

      filtro = {
        $or: [
          { titulo: regex },
          { autor: regex }
        ]
      };
    }
    const libros = await Libro.find(filtro);
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los libros', error: error.message });
  }
};

// POST /api/libros
export const createLibro = async (req, res) => {
  try {
    const nuevoLibro = new Libro(req.body); // req.body tiene {titulo, autor, etc.}
    const libroGuardado = await nuevoLibro.save();
    res.status(201).json(libroGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el libro', error: error.message });
  }
};

// PUT /api/libros/:id
export const updateLibro = async (req, res) => {
  try {
    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Devuelve el documento actualizado
    );
    if (!libroActualizado) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(libroActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el libro', error: error.message });
  }
};

// DELETE /api/libros/:id
export const deleteLibro = async (req, res) => {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);
     if (!libroEliminado) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el libro', error: error.message });
  }
};