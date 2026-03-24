/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        snow: '#f8f8f8',
        paper: '#ffffff',
        mist: '#d4d4d4',
      },
      boxShadow: {
        'mono-lg': '0 20px 50px -25px rgba(0, 0, 0, 0.65)',
      },
    },
  },
  plugins: [],
};
