/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // Modern color palette
        charcoal: '#121212',
        'off-white': '#F8FAFC',
        brand: {
          50: '#ECFDF5',   // emerald-50
          100: '#D1FAE5',  // emerald-100
          200: '#A7F3D0',  // emerald-200
          300: '#6EE7B7',  // emerald-300
          400: '#34D399',  // emerald-400
          500: '#10B981',  // 辅助色 - emerald-500
          600: '#059669',  // 主色 - emerald-600
          700: '#047857',  // emerald-700
          800: '#065F46',  // emerald-800
          900: '#064E3B',  // emerald-900
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
