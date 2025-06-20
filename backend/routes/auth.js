// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const Usuario = require('../modelos/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: 'Usuario o contraseña incorrecta' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(400).json({ mensaje: 'Usuario o contraseña incorrecta' });

    // Generar token con id y rol
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, rol: usuario.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

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

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ mensaje: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'No autorizado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });
    req.usuario = decoded;
    next();
  });
}

function permisoRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    next();
  };
}

// Attach these as properties to the router for external use if needed:
router.verificarToken = verificarToken;
router.permisoRol = permisoRol;

module.exports = router;
