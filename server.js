// 1. Importaciones (ES Modules)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'; // Esto reemplaza require('dotenv').config()

// 2. Importar tus rutas (¡con .js al final!)
import libroRoutes from './routes/libro.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import prestamoRoutes from './routes/prestamo.routes.js';
import authRoutes from './routes/auth.routes.js';

// --- Configuración Principal ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Conexión a MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas de API ---
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de la Biblioteca funcionando' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// --- CORRECCIÓN AQUÍ ---
// Esta es la ruta que tu frontend (usuario.service.ts) estaba buscando.
app.get('/api/test/connection', (req, res) => {
  res.json({ message: '¡Conexión con el backend exitosa!' });
});
// --- FIN DE LA CORRECCIÓN ---


// Aquí van TODAS tus rutas, JUNTAS
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/auth', authRoutes);

// --- Iniciar el Servidor (SIEMPRE AL FINAL) ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});