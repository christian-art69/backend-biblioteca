
import mongoose from 'mongoose';

const historicoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Libro',
    required: true
  },
  fechaPrestamo: {
    type: Date,
    required: true
  },
  fechaDevolucionReal: {
    type: Date,
    default: Date.now
  },
  fechaDevolucionEstimada: {
    type: Date
  },
  estadoEntrega: { 
    type: String,
    enum: ['A tiempo', 'Atrasado']
  },
  observaciones: {
    type: String,
    default: 'Sin observaciones'
  }
}, { timestamps: true });

const Historico = mongoose.model('Historico', historicoSchema);
export default Historico;