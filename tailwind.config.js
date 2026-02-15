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
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Warm sunset orange
          600: '#ea580c', // Rich coral
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        earth: {
          50: '#faf5f0',
          100: '#f5ebe0',
          200: '#e8d5c4',
          300: '#d4b8a0',
          400: '#b8956a',
          500: '#9d7a4f', // Warm brown
          600: '#7d6140',
          700: '#5d4830',
          800: '#3d3020',
          900: '#1d1810',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cfc7',
          300: '#a3b3a3',
          400: '#7a907a',
          500: '#5d735d', // Sage green
          600: '#4a5c4a',
          700: '#3d4b3d',
          800: '#333e33',
          900: '#2b342b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

