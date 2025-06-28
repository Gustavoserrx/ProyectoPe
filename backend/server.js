// Carga variables de entorno (usa './.env.local' si quieres, o solo .env)
require('dotenv').config({ path: './.env.local' });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Leer la URI desde la variable de entorno correcta
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ Error: La variable MONGODB_URI no está definida en .env');
  process.exit(1);
}

// Conexión a MongoDB
mongoose.connect(uri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Middleware CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Importar modelos
const Ejercicio = require('./modelos/ejercicio');
const Rutina = require('./modelos/rutina');

// Rutas ejercicios
app.get('/api/ejercicios', async (req, res) => {
  try {
    const ejercicios = await Ejercicio.find();
    res.json(ejercicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
});

app.post('/api/ejercicio', async (req, res) => {
  try {
    const nuevoEjercicio = new Ejercicio(req.body);
    await nuevoEjercicio.save();
    res.status(201).json(nuevoEjercicio);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear ejercicio' });
  }
});

// Rutas rutinas
app.get('/api/rutina', async (req, res) => {
  try {
    const filtros = {};
    if (req.query.usuario) filtros.usuario = req.query.usuario;
    if (req.query.semana) filtros.semana = req.query.semana;

    const rutinas = await Rutina.find(filtros)
      .populate('usuario', 'nombre email')
      .populate('dias.ejercicios.ejercicio');

    res.json(rutinas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rutinas' });
  }
});

app.post('/api/rutina', async (req, res) => {
  try {
    const nuevaRutina = new Rutina(req.body);
    await nuevaRutina.save();
    res.status(201).json(nuevaRutina);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear rutina' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => res.send('API Rutinas funcionando 🔥'));

// Rutas auth
app.use('/api/auth', require('./routes/auth'));

// Puerto
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});