/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#D4BFFF',
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        secondary: {
          light: '#FBBFDF',
          DEFAULT: '#EC4899',
          dark: '#DB2777',
        },
      },
    },
  },
  plugins: [],
}
