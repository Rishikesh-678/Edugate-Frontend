/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F9A826', // EduGate Orange
          dark: '#F29C1F',
        },
        secondary: {
          DEFAULT: '#4A4A4A', // Dark Gray
          light: '#F4F4F4', // Light Gray BG
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};