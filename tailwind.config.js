/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f8faf8',
          100: '#f1f5f1',
          200: '#e2e8e2',
          300: '#cbd5cb',
          400: '#a3b8a3',
          500: '#7a9b7a',
          600: '#5f7a5f',
          700: '#4a5f4a',
          800: '#3b4a3b',
          900: '#2f3a2f',
        },
        lavender: {
          50: '#faf9ff',
          100: '#f3f1ff',
          200: '#e9e5ff',
          300: '#d4ccff',
          400: '#b8a6ff',
          500: '#9c7cff',
          600: '#8b5cf6',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
        },
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
