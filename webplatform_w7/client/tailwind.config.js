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
          green: "#23ce6b",       // Vivid Green: Accent / CTA / Success
          charcoal: "#272d2d",    // Dark Charcoal: Sidebar / Cards / Primary Text
          dark: "#1e2222",        // Darker tone for backgrounds
        },
        neutral: {
          light: "#ffffff",       // White
          offwhite: "#f9fafb",    // Grey 50 / Off-white page background
          grayText: "#6b7280",    // Secondary text
        }
      },
      borderRadius: {
        'brand-sm': '8px',
        'brand-md': '12px',
        'brand-lg': '16px',
      },
      boxShadow: {
        'brand-soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'brand-glow': '0 0 15px rgba(35, 206, 107, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
