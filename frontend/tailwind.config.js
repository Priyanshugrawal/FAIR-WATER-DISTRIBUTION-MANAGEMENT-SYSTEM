/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1D4ED8',
          foreground: '#F8FAFC',
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          foreground: '#0F172A',
        },
        success: '#22C55E',
        warning: '#FACC15',
        danger: '#EF4444',
        midnight: '#0B1120',
      },
      boxShadow: {
        card: '0 10px 30px rgba(15,23,42,0.08)',
      },
    },
  },
  plugins: [],
};

