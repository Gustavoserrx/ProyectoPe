const fetch = require('node-fetch').default || require('node-fetch');

async function probarLogin(email, password) {
  try {
    const response = await fetch('http://localhost:5100/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login exitoso:', data);
    } else {
      console.log('Error en login:', data.message);
    }
  } catch (error) {
    console.error('Error al hacer login:', error);
  }
}

// Cambia aquí el email que te imprima el script de creación de usuario
const emailDePrueba = 'bertrand_deckow35@gmail.com';
const passwordDePrueba = 'miclave123';

probarLogin(emailDePrueba, passwordDePrueba);