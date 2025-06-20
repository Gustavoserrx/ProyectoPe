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