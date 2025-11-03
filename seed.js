import mongoose from 'mongoose';
import 'dotenv/config';
import Usuario from './models/usuario.model.js';
import Libro from './models/libro.model.js';
import Prestamo from './models/prestamo.model.js';
import Historico from './models/historico.model.js';
const usuariosDePrueba = [
  {
    nombre: 'Administrador del Sistema',
    correo: 'admin@biblioteca.cl',
    rut: '11.111.111-1',
    password: 'admin123', // Mongoose (bcrypt) lo hasheará
    rol: 'Admin',
    cargo: 'Bibliotecario',
    situacion: 'Vigente'
  },
  {
    nombre: 'Estudiante de Prueba',
    correo: 'estudiante@biblioteca.cl',
    rut: '22.222.222-2',
    password: 'usuario123', // Mongoose (bcrypt) lo hasheará
    rol: 'Usuario',
    cargo: 'Estudiante',
    situacion: 'Vigente'
  }
];

const librosDePrueba = [
  {
    titulo: 'Cien Años de Soledad',
    autor: 'Gabriel García Márquez',
    genero: 'Realismo Mágico',
    ano: 1967,
    cantidad: 10
  },
  {
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    genero: 'Novela',
    ano: 1605,
    cantidad: 5
  },
  {
    titulo: '1984',
    autor: 'George Orwell',
    genero: 'Distopía',
    ano: 1949,
    cantidad: 7
  }
];

const seedDatabase = async () => {
  try {
    // Conéctate a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas.');

    // Limpiar datos existentes
    console.log('🧹 Limpiando colecciones...');
    await Usuario.deleteMany({});
    await Libro.deleteMany({});
    await Prestamo.deleteMany({});
    await Historico.deleteMany({});
    console.log('🧼 Colecciones limpias.');

    // Insertar nuevos datos
    console.log('🌱 Insertando datos de prueba...');
    
    // Usamos .create() para Usuarios para que se ejecute el hook 'pre-save' de bcrypt
    await Usuario.create(usuariosDePrueba);
    
    // Para Libros, .insertMany() es más rápido ya que no necesita hooks
    await Libro.insertMany(librosDePrueba); 

    console.log('🎉 ¡Base de datos poblada exitosamente!');
    console.log('--- Cuentas Creadas ---');
    console.log(`🔑 Admin: admin@biblioteca.cl / admin123`);
    console.log(`🔑 Usuario: estudiante@biblioteca.cl / usuario123`);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    // 3. Desconectar
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB.');
  }
};

// Ejecutar el script
seedDatabase();