/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff6a00',
        'primary-dark': '#d45a00',
        'primary-light': '#ff8a30',
        background: '#000000',
        'background-light': '#121212',
        'background-dark': '#000000',
        'text-primary': '#ffffff',
        'text-secondary': '#cccccc',
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#f87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'button': '0.75rem',
      },
      animation: {
        'button-press': 'button-press 0.1s ease-in-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-in-out',
      },
      keyframes: {
        'button-press': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}