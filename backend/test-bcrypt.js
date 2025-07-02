const bcrypt = require('bcrypt');

const hash = '$2b$10$fXzBIQl0GazIbKZfLT6I3u75m2YutjcB7Ha1KM2.PZMWZN2eeqARW'; // El hash que tienes en tu BBDD
const passwordToTest = 'gwendolyn.zulauf21´'; // Cambia aquí por la contraseña que quieres probar

bcrypt.compare(passwordToTest, hash)
  .then(result => {
    if (result) {
      console.log('✅ La contraseña coincide con el hash');
    } else {
      console.log('❌ La contraseña NO coincide con el hash');
    }
  })
  .catch(err => {
    console.error('Error al comparar:', err);
  });