import mongoose from 'mongoose';

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  },
  editorial: {
    type: String
  },
  anoPublicacion: {
    type: Number
  },
  genero: {
    type: String
  },
  disponible: {
    type: Boolean,
    default: true // Importante para la lógica de préstamos
  }
}, {
  timestamps: true
});

const Libro = mongoose.model('Libro', libroSchema);

export default Libro;