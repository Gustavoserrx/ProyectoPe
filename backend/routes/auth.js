const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'una_clave_super_secreta';
const express = require('express');
const router = express.Router();
const User = require('../modelos/usuario'); // Ajusta ruta si es necesario
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: { message: 'Demasiados intentos, prueba en 15 minutos' }
});

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    console.log('Register data:', req.body);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email: email.toLowerCase(), password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  const { email, password } = req.body;

  console.log('Email recibido:', email);

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('Usuario encontrado:', user);

    if (!user) {
      console.log('⚠️ Usuario NO encontrado en la colección usuarios');
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Contraseña válida?', isPasswordValid);

    if (!isPasswordValid) {
      console.log('⚠️ Contraseña INCORRECTA');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ Inicio de sesión exitoso');
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.json({ message: 'Inicio de sesión exitoso', token });

  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
