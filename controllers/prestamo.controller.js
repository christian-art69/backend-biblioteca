import Prestamo from '../models/prestamo.model.js';
import Libro from '../models/libro.model.js';
import Usuario from '../models/usuario.model.js';
import Historico from '../models/historico.model.js'; 

export const createPrestamo = async (req, res) => {
  const { usuarioId, libroId, fechaDevolucionLimite } = req.body;

  try {
    const libro = await Libro.findById(libroId);
    if (!libro || !libro.disponible) {
      return res.status(400).json({ message: 'Libro no disponible' });
    }
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario || usuario.situacion !== 'Vigente') {
      return res.status(400).json({ message: 'Usuario no apto para préstamo (situación no vigente)' });
    }
    const nuevoPrestamo = new Prestamo({
      usuario: usuarioId,
      libro: libroId,
      fechaDevolucionLimite
    });
    await nuevoPrestamo.save();
    await Libro.findByIdAndUpdate(libroId, { disponible: false });
    await Usuario.findByIdAndUpdate(usuarioId, { situacion: 'Prestamo Activo' });

    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error('Error al crear préstamo:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const devolverPrestamo = async (req, res) => {

  try {
    const prestamo = await Prestamo.findById(req.params.id);
    if (!prestamo) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }
    if (prestamo.estado === 'Devuelto') {
      return res.status(400).json({ message: 'Este libro ya fue devuelto' });
    }

    const fechaDevolucionReal = Date.now();
    prestamo.estado = 'Devuelto';
    prestamo.fechaDevolucionReal = fechaDevolucionReal;
    await prestamo.save();
    await Libro.findByIdAndUpdate(prestamo.libro, { disponible: true });
    
    const estadoEntrega = fechaDevolucionReal > prestamo.fechaDevolucionLimite ? 'Atrasado' : 'A tiempo';
    const nuevoHistorico = new Historico({
      usuario: prestamo.usuario,
      libro: prestamo.libro,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucionReal: fechaDevolucionReal,
      fechaDevolucionEstimada: prestamo.fechaDevolucionLimite,
      estadoEntrega: estadoEntrega
    });
    await nuevoHistorico.save();
   
    const otrosPrestamosActivos = await Prestamo.findOne({
      usuario: prestamo.usuario,
      estado: 'Activo'
    });

    if (!otrosPrestamosActivos) {
      await Usuario.findByIdAndUpdate(prestamo.usuario, { situacion: 'Vigente' });
    }
    res.json({ message: 'Libro devuelto exitosamente', prestamo });
  } catch (error) {
    console.error('Error al devolver préstamo:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAllPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.find()
      .populate('usuario', 'nombre correo rut') 
      .populate('libro', 'titulo autor');      
    res.json(prestamos);
  } catch (error) {
    console.error('Error al obtener préstamos:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getMisPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.find({ usuario: req.user.id, estado: 'Activo' }) 
      .populate('libro', 'titulo autor fechaDevolucionLimite');
    
    if (!prestamos) {
      return res.json([]); 
    }
    res.json(prestamos);
  } catch (error) {
    console.error('Error al obtener mis préstamos:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPrestamosPorUsuario = async (req, res) => {
  try {
    const prestamos = await Prestamo.find({ usuario: req.params.usuarioId, estado: 'Activo' })
      .populate('libro', 'titulo autor');
    res.json(prestamos);
  } catch (error) {
    console.error('Error al obtener préstamos por usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
export const getHistorialTodos = async (req, res) => {
  try {
    const historial = await Historico.find()
      .populate('usuario', 'nombre rut')
      .populate('libro', 'titulo');
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener todo el historial:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getHistorialPorUsuario = async (req, res) => {
  try {
    const historial = await Historico.find({ usuario: req.params.usuarioId })
      .populate('libro', 'titulo');
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial por usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};