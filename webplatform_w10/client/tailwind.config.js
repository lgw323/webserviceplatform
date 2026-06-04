/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0f172a',
          darker: '#0b0f19',
          card: '#1e293b',
          accent: '#3b82f6',
          purple: '#8b5cf6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        /* CSS Custom Properties 기반 테마 색상 */
        theme: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          'card-hover': 'var(--color-card-hover)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-muted': 'var(--color-text-muted)',
          border: 'var(--color-border)',
          'input-bg': 'var(--color-input-bg)',
        },
        /* WCAG AA 대비비 4.5:1 이상 확보된 보조 텍스트 색상 */
        a11y: {
          muted: '#9ca3af',    /* gray-400 — #0b0f19 위에서 대비비 약 7.5:1 */
          subtle: '#d1d5db',   /* gray-300 — 강조 보조 텍스트용 */
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        glitch: 'glitch 0.2s infinite',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      }
    },
  },
  plugins: [],
}
