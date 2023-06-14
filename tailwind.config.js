/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      boxShadow: {
        'vignette': 'inset 0 0 600px rgba(0,0,0,1)'
      },
    },
    colors: {
      dark1: '#0f172a',
      light1: '#ffffff',
      accent: '#ff4533'
    }
  },
  plugins: [],
}

