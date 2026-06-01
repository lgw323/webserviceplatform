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
        /* WCAG AA 대비비 4.5:1 이상 확보된 보조 텍스트 색상 */
        a11y: {
          muted: '#9ca3af',    /* gray-400 — #0b0f19 위에서 대비비 약 7.5:1 */
          subtle: '#d1d5db',   /* gray-300 — 강조 보조 텍스트용 */
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
