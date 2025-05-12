module.exports = {
  darkMode: 'class', // activa modo oscuro por clase
  content: [
  // ...
    "./dist/**/*.html", // Asegúrate de que Tailwind CSS analice tu archivo HTML
    "./src/**/*.js",    // Si tienes archivos JS que contienen clases de Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
