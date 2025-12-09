/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2fdf4',
          100: '#e1fce7',
          500: '#22c55e', 
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#fdfbf7', 
          100: '#f7f3e8',
          200: '#efe8d3',
          800: '#5c4d3c',
          900: '#3e3223',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      // Animation Logic
      animation: {
        'gradient-slow': 'gradient 15s ease infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      }
    },
  },
  plugins: [],
}