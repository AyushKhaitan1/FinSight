/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-background)',
        surface: 'var(--bg-surface)',
        foreground: 'var(--text-foreground)',
        muted: 'var(--text-muted)',
        border: 'var(--border-color)',
        primary: '#6366F1',
        secondary: '#A855F7',
        success: '#10B981',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
