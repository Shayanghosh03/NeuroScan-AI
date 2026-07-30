/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a9f7',
          500: '#0c8de9',
          600: '#006ec7',
          700: '#0258a3',
          800: '#064b86',
          900: '#0b3f6f',
          950: '#07284a',
        },
        medical: {
          teal: '#00b4d8',
          cyan: '#90e0ef',
          dark: '#0a192f',
          slate: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(12, 141, 233, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(12, 141, 233, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
