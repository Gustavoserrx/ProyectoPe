// backend/routes/usuarios.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) return res.status(400).json({ mensaje: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'usuario'
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
// backend/createUsuario.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./modelos/usuario'); // Ajusta ruta si es necesario

require('dotenv').config({ path: '.env.local' });

console.log('MONGODB_URI:', process.env.MONGODB_URI);

async function createUsuario(nombre, email, password, rol = 'usuario') {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword, rol });

    await nuevoUsuario.save();

    console.log(`✅ Usuario ${nombre} creado correctamente`);

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

// Cambia estos valores para crear el usuario deseado
createUsuario('Gusi', 'gusi@email.com', 'miPassSeguro');