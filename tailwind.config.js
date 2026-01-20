/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pars: {
          gold: '#D4AF37',
          bronze: '#CD7F32',
          persian: '#1C3879',
          deep: '#0A1628',
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
