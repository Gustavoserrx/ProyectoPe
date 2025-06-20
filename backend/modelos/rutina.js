const mongoose = require('mongoose');

const RutinaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  semana: String, // Por ejemplo: '2025-W25'
  dias: [
    {
      dia: String, // 'Lunes', 'Martes', etc.
      ejercicios: [
        {
          ejercicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Ejercicio' },
          series: Number,
          repeticiones: Number,
          nota: String
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Rutina', RutinaSchema);