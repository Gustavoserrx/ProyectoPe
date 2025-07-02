const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const User = require('./modelos/usuario'); // Ajusta la ruta a tu modelo

async function createManualUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // 👉 Personaliza estos valores a mano
    const email = 'gusi@prueba.com';
    const plainPassword = 'miclave123';

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Crear usuario
    const newUser = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await newUser.save();

    console.log('✅ Usuario creado correctamente:');
    console.log(`Email: ${email}`);
    console.log(`Contraseña en texto plano: ${plainPassword}`);
    console.log(`Hash guardado: ${hashedPassword}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  }
}

createManualUser();