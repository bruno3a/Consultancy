/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'azul-profundo': '#2A5C8B',
        'azul-turquesa': '#4ECDC4',
        'blanco-roto': '#F5F7FA',
        'gris-neutro': '#6C7A89',
        'verde-agua': '#88D8B0',
      }
    },
  },
  plugins: [],
}
