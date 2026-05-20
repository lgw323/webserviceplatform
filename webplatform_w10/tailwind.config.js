/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#23ce6b',
          charcoal: '#272d2d',
          dark: '#1e2222',
        },
        neutral: {
          offwhite: '#f9fafb',
          grayText: '#6b7280',
        }
      },
      borderRadius: {
        'brand-lg': '1rem',
        'brand-md': '0.75rem',
        'brand-sm': '0.5rem',
      },
      boxShadow: {
        'brand-soft': '0 4px 20px -2px rgba(39, 45, 45, 0.05)',
        'brand-glow': '0 0 15px rgba(35, 206, 107, 0.4)',
      }
    },
  },
  plugins: [],
}
