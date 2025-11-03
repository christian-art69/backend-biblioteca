import Prestamo from '../models/prestamo.model.js';
import Libro from '../models/libro.model.js';
import Usuario from '../models/usuario.model.js';
import Historico from '../models/historico.model.js'; 

export const createPrestamo = async (req, res) => {
  const { usuarioId, libroId, fechaDevolucionLimite } = req.body;

  try {
    //Verificar si el libro está disponible
    const libro = await Libro.findById(libroId);
    if (!libro || !libro.disponible) {
      return res.status(400).json({ message: 'Libro no disponible' });
    }

    //Verificar si el usuario está vigente
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario || usuario.situacion !== 'Vigente') {
      return res.status(400).json({ message: 'Usuario no apto para préstamo (situación no vigente)' });
    }

    //Crear el préstamo
    const nuevoPrestamo = new Prestamo({
      usuario: usuarioId,
      libro: libroId,
      fechaDevolucionLimite
    });
    await nuevoPrestamo.save();

    //Actualizar el estado del libro y del usuario
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

    //Actualizar el préstamo
    const fechaDevolucionReal = Date.now();
    prestamo.estado = 'Devuelto';
    prestamo.fechaDevolucionReal = fechaDevolucionReal;
    await prestamo.save();

    //Actualizar el libro (vuelve a estar disponible)
    await Libro.findByIdAndUpdate(prestamo.libro, { disponible: true });

    //CREAR REGISTRO EN HISTORIAL ---
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
    // Verificamos si el usuario AÚN tiene otros préstamos activos
    const otrosPrestamosActivos = await Prestamo.findOne({
      usuario: prestamo.usuario,
      estado: 'Activo'
    });

    // Si NO tiene más préstamos activos, su situación vuelve a 'Vigente'
    if (!otrosPrestamosActivos) {
      await Usuario.findByIdAndUpdate(prestamo.usuario, { situacion: 'Vigente' });
    }
    // Si tiene otros préstamos, su situación sigue siendo 'Prestamo Activo' (no hacemos nada)
    // ------------------------------------------

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
    const prestamos = await Prestamo.find({ usuario: req.user.id })
      .populate('libro', 'titulo autor fechaDevolucionLimite');
    
    if (!prestamos) {
      return res.json([]); // Devuelve array vacío si no tiene
    }
    res.json(prestamos);
  } catch (error) {
    console.error('Error al obtener mis préstamos:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};