/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          gold: '#9B8A5E',       // STARLUX 大地金 (Earth Gold)
          goldLight: '#C9A86C',  // 香檳亮金
          goldDark: '#7B6D45',   // 深焙金
          rose: '#B4745A',       // 玫瑰金 (Rose Gold)
          obsidian: '#121214',   // macOS / iOS 曜石深灰背景
          obsidianLight: '#1E1E22', // 深色模式毛玻璃卡片背景
          warmBeige: '#F7F5F2',  // 星宇淺色暖米白背景
        },
        pine: {
          DEFAULT: '#24554F',
          primary: '#266461',
          dark: '#1D4742',
          soft: '#E3F3F0',
          border: '#D5E2E0',
          gold: '#C58B59',
        },
        pk: {
          crimson: '#b52459',
          crimsonDark: '#921b46',
          borderPink: '#d89ab0',
          paper: '#faf8f6',
          board: '#233b30',
          boardFrame: '#69513b',
          noteYellow: '#fef7cd',
          noteBorder: '#e8d058',
          scoreBlue: '#1f449c',
          rulerYellow: '#f7e06d',
        }
      },
      boxShadow: {
        'premium-light': '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 2px 12px -2px rgba(155, 138, 94, 0.08)',
        'premium-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(201, 168, 108, 0.16)',
        'gold-glow': '0 0 25px 2px rgba(155, 138, 94, 0.25)',
        'rose-glow': '0 0 25px 2px rgba(180, 116, 90, 0.25)',
      },
      fontFamily: {
        sans: ['"Montserrat"', '"Noto Sans TC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Rufina"', '"Noto Serif TC"', 'serif'],
        hand: ['"Montserrat"', '"Noto Sans TC"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
