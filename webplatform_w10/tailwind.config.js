/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#00ff66', // brighter neon green
          charcoal: '#f3f4f6', // high-contrast white text for default brand color
          dark: '#0a0d10',
          panel: '#13171d',
          card: '#181e26',
        },
        neutral: {
          offwhite: '#0e1115',
          grayText: '#9ca3af',
        }
      },
      borderRadius: {
        'brand-lg': '1rem',
        'brand-md': '0.75rem',
        'brand-sm': '0.5rem',
      },
      boxShadow: {
        'brand-soft': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'brand-glow': '0 0 20px rgba(0, 255, 102, 0.35)',
        'brand-glow-subtle': '0 0 15px rgba(0, 255, 102, 0.15)',
      }
    },
  },
  plugins: [],
}
