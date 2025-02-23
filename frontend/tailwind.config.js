/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Crimson Pro"', 'serif'],
        title: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
};