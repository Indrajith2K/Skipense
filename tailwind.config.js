/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'skipense-dark': '#1B3530',
        'skipense-lime': '#C7F269',
        'skipense-ink': '#112320',
        'skipense-mist': '#ECECEC',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.04)',
        'card': '0 4px 20px rgba(17,35,32,0.06)',
      },
    },
  },
  plugins: [],
}
