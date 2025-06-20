require('dotenv').config();  // Carga variables del archivo .env

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));
// Cargamos las variables de entorno (como MONGO_URI y PORT)
require('dotenv').config({ path: './.env.local' });
// Importamos módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inicializamos la app de Express
const app = express();

// Configuración CORS para permitir todos los orígenes durante el desarrollo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware para que Express entienda JSON
app.use(express.json());

// Ruta de prueba para comprobar que el servidor funciona
app.get('/', (req, res) => res.send('API Rutinas funcionando 🔥'));

// Conexión a MongoDB usando Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Modelos
const Ejercicio = require('./modelos/ejercicio');
const Rutina = require('./modelos/rutina');

// --- RUTAS EJERCICIOS ---

// Obtener todos los ejercicios
app.get('/api/ejercicios', async (req, res) => {
  try {
    const ejercicios = await Ejercicio.find();
    res.json(ejercicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
});

// Crear ejercicio
app.post('/api/ejercicio', async (req, res) => {
  try {
    const nuevoEjercicio = new Ejercicio(req.body);
    await nuevoEjercicio.save();
    res.status(201).json(nuevoEjercicio);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear ejercicio' });
  }
});

// --- RUTINAS ---

// Obtener rutinas filtrando por usuario y/o semana (opcional)
app.get('/api/rutina', async (req, res) => {
  try {
    const filtros = {};
    if (req.query.usuario) filtros.usuario = req.query.usuario;
    if (req.query.semana) filtros.semana = req.query.semana;

    const rutinas = await Rutina.find(filtros)
      .populate('usuario', 'nombre email')   // si tienes modelo usuario con nombre y email
      .populate('dias.ejercicios.ejercicio'); // carga detalles ejercicios

    res.json(rutinas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rutinas' });
  }
});

// Crear rutina
app.post('/api/rutina', async (req, res) => {
  try {
    const nuevaRutina = new Rutina(req.body);
    await nuevaRutina.save();
    res.status(201).json(nuevaRutina);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear rutina' });
  }
});

// Ponemos a escuchar el servidor en el puerto indicado
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
app.use('/api/auth', require('./routes/auth'));