/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          light: '#90EE90',
          medium: '#228B22', 
          dark: '#006400'
        }
      }
    },
  },
  plugins: [],
}