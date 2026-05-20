/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        surface: {
          0: '#09090b',
          1: '#111114',
          2: '#18181b',
          3: '#1f1f23',
          4: '#27272a',
        },
        accent: {
          DEFAULT: '#6d5dfc',
          light: '#8b7ffd',
          dim: '#4a3db8',
          glow: 'rgba(109, 93, 252, 0.25)',
        },
        mint: {
          DEFAULT: '#2dd4bf',
          dim: '#0d9488',
        },
        rose: {
          DEFAULT: '#fb7185',
          dim: '#be123c',
        },
        sky: {
          DEFAULT: '#38bdf8',
          dim: '#0369a1',
        },
        txt: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          muted: '#52525b',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(109, 93, 252, 0.3)',
        'glow-sm': '0 0 20px -5px rgba(109, 93, 252, 0.2)',
        card: '0 8px 32px -8px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'progress': 'progress 2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
