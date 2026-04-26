/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f5f0f6', // light dusky background
        leather: '#722f37', // wine red
        ink: '#0a192f', // dark navy blue
        accent: '#9c6b8c', // dusky orchid
        secondary: '#1e3a8a', // navy blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
