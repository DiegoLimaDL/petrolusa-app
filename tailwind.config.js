/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petrolusa: {
          DEFAULT: '#0A5C36',
          dark: '#064025',
          light: '#E8F3EE',
          accent: '#15803D'
        }
      }
    },
  },
  plugins: [],
}
