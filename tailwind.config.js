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
        // Base surfaces
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
          elevated: 'var(--surface-elevated)',
          subtle: 'var(--surface-subtle)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },

        // Typography
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',

        // Brand colors
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
          deep: 'var(--primary-deep)',
          fg: 'var(--primary-fg)',
        },

        // Supporting & Semantic
        success: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        rating: 'var(--rating)',

        // Semantic alerts
        warning: {
          DEFAULT: 'var(--warning)',
          soft: 'var(--warning-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
          border: 'var(--danger-border)',
        },

        // Backward compatibility aliases
        flame: {
          50: 'var(--primary-soft)',
          100: 'var(--primary-soft)',
          200: 'var(--primary-soft)',
          300: 'var(--primary)',
          400: 'var(--primary)',
          500: 'var(--primary)',
          600: 'var(--primary-hover)',
          700: 'var(--primary-deep)',
          800: 'var(--primary-deep)',
          900: 'var(--primary-deep)',
          DEFAULT: 'var(--primary)',
        },
        lilac: {
          50: 'var(--surface-muted)',
          100: 'var(--surface-muted)',
          200: 'var(--border)',
          300: 'var(--border)',
          400: 'var(--text-secondary)',
          500: 'var(--text-muted)',
          DEFAULT: 'var(--text-secondary)',
        },
        seal: {
          50: 'var(--background)',
          100: 'var(--surface-muted)',
          200: 'var(--border)',
          800: 'var(--surface)',
          900: 'var(--text-primary)',
          DEFAULT: 'var(--text-primary)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        button: '10px',
        input: '9px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lifted: '0 8px 24px rgba(0, 0, 0, 0.14)',
        subtle: '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
