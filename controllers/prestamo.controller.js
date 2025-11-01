import Prestamo from '../models/prestamo.model.js';
import Libro from '../models/libro.model.js';
import Usuario from '../models/usuario.model.js';

// --- (Solo Admin) ---
// POST /api/prestamos
export const createPrestamo = async (req, res) => {
  const { usuarioId, libroId, fechaDevolucionLimite } = req.body;

  try {
    // 1. Verificar si el libro está disponible
    const libro = await Libro.findById(libroId);
    if (!libro || !libro.disponible) {
      return res.status(400).json({ message: 'Libro no disponible' });
    }

    // 2. Verificar si el usuario está vigente
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario || usuario.situacion !== 'Vigente') {
      return res.status(400).json({ message: 'Usuario no apto para préstamo (situación no vigente)' });
    }

    // 3. Crear el préstamo
    const nuevoPrestamo = new Prestamo({
      usuario: usuarioId,
      libro: libroId,
      fechaDevolucionLimite
    });
    await nuevoPrestamo.save();

    // 4. Actualizar el estado del libro y del usuario
    await Libro.findByIdAndUpdate(libroId, { disponible: false });
    await Usuario.findByIdAndUpdate(usuarioId, { situacion: 'Prestamo Activo' });

    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el préstamo', error: error.message });
  }
};

// --- (Solo Admin) ---
// PUT /api/prestamos/:id/devolver
export const devolverPrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findById(req.params.id);
    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }
    if (prestamo.estado === 'Devuelto') {
      return res.status(400).json({ message: 'Este libro ya fue devuelto' });
    }

    // 1. Actualizar el préstamo
    prestamo.estado = 'Devuelto';
    prestamo.fechaDevolucionReal = Date.now();
    await prestamo.save();

    // 2. Actualizar el libro (vuelve a estar disponible)
    await Libro.findByIdAndUpdate(prestamo.libro, { disponible: true });

    // 3. Actualizar el usuario (vuelve a estar vigente)
    // (Aquí podrías añadir lógica para verificar si tiene otros préstamos)
    await Usuario.findByIdAndUpdate(prestamo.usuario, { situacion: 'Vigente' });

    res.json({ message: 'Libro devuelto exitosamente', prestamo });
  } catch (error) {
    res.status(500).json({ message: 'Error al devolver el préstamo', error: error.message });
  }
};

// --- (Solo Admin) ---
// GET /api/prestamos (Obtener todos)
export const getAllPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.find()
      .populate('usuario', 'nombre correo rut') // Trae info del usuario
      .populate('libro', 'titulo autor');      // Trae info del libro
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener préstamos', error: error.message });
  }
};

// --- (Usuario logueado) ---
// GET /api/prestamos/mis-prestamos
export const getMisPrestamos = async (req, res) => {
  try {
    // req.user.id viene del middleware verifyToken
    const prestamos = await Prestamo.find({ usuario: req.user.id })
      .populate('libro', 'titulo autor fechaDevolucionLimite');
    
    if (!prestamos) {
      return res.json([]); // Devuelve array vacío si no tiene
    }
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mis préstamos', error: error.message });
  }
};