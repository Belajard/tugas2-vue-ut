/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#003d79',
        'primary-container': '#002b56',
        secondary: '#fdb913',
        'secondary-container': '#fdb913',
        accent: '#fdb913',
        onSecondary: '#003d79',
      },
      fontFamily: {
        sans: ['Inter', 'Public Sans', 'sans-serif'],
        body: ['Inter', 'Lexend', 'sans-serif'],
      },
      boxShadow: { card: '0 1px 3px rgba(0,0,0,0.1)' },
    },
  },
  plugins: [],
}
