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
        // Modern color palette - Olive Green Theme
        charcoal: '#121212',
        'off-white': '#FAFAF9',  // 背景色
        brand: {
          50: '#F5F7F0',   // 极浅橄榄绿
          100: '#E8EDD9',  // 浅橄榄绿
          200: '#D4DFBB',  // 浅绿背景
          300: '#BFD19D',  // 中浅绿
          400: '#A7C957',  // 辅助色 - hover, button
          500: '#93B84A',  // 辅助色深一点
          600: '#6B8F3D',  // 中深绿
          700: '#4B6344',  // 主色 - review card
          800: '#3A4D35',  // 深绿
          900: '#2A3727',  // 最深橄榄绿
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
