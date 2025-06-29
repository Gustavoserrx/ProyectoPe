const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('./modelos/usuario'); // Ajusta ruta

require('dotenv').config({ path: '.env.local' });

async function createRandomUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Genera datos aleatorios únicos
    const username = faker.internet.username().toLowerCase();
    const email = faker.internet.email().toLowerCase();
    const password = 'miPasswordSeguro'; 

    // Cifra la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el usuario
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    console.log('Usuario guardado con _id:', user._id);

    console.log(`✅ Usuario creado: ${username} - ${email}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

createRandomUser();