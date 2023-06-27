/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      keyframes: {
        'pulse-custom': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.2 },
        },
      },
      animation: {
        'pulse-custom': 'pulse-custom 200ms linear infinite',
      },
    },
    colors: {
      dark1: '#0f172a',
      light1: '#ffffff',
      accent: '#ff4533',
      accent2: '#075ea6'
    }
  },
  plugins: [],
}