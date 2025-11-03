import mongoose from 'mongoose';
const { Schema } = mongoose;

const prestamoSchema = new Schema({
  libro: {
    type: Schema.Types.ObjectId,
    ref: 'Libro', 
    required: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', 
    required: true
  },
  fechaPrestamo: {
    type: Date,
    default: Date.now
  },
  fechaDevolucionLimite: {
    type: Date,
    required: true
  },
  fechaDevolucionReal: {
    type: Date 
  },
  estado: {
    type: String,
    enum: ['Activo', 'Devuelto', 'Atrasado'],
    default: 'Activo'
  }
}, {
  timestamps: true
});

const Prestamo = mongoose.model('Prestamo', prestamoSchema);

export default Prestamo;