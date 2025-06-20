const mongoose = require('mongoose');

const EjercicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  videoUrl: String, // Link de YouTube, Vimeo o archivo
  grupoMuscular: String, // Ej: "Pecho", "Espalda", "Piernas"
  dificultad: { type: String, enum: ['Fácil', 'Medio', 'Difícil'], default: 'Medio' },
  duracion: { type: Number, default: 30 }, // Duración en segundos
  repeticiones: { type: Number, default: 10 }, // Repeticiones por serie
  series: { type: Number, default: 3 }, // Número de series
  descanso: { type: Number, default: 60 }, // Descanso entre series en segundos
  fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ejercicios', EjercicioSchema);