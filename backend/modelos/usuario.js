const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, required: true, unique: true },
  password: String, // Encriptado (usaremos bcrypt)
  rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);