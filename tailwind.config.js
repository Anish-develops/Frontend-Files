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

        // Primary brand — Blush Pink
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
          deep: 'var(--primary-deep)',
          fg: 'var(--primary-fg)',
        },

        // Highlighting & CTAs — Electric Lime
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          fg: 'var(--accent-fg)',
        },

        // Secondary accents — Warm Peach & Soft Lavender
        peach: {
          DEFAULT: 'var(--peach)',
          soft: 'var(--peach-soft)',
        },
        lavender: {
          DEFAULT: 'var(--lavender)',
          soft: 'var(--lavender-soft)',
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

        // Aliases for compatibility
        flame: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      scale: {
        98: '0.98',
        102: '1.02',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '10px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
        lifted: '0 8px 30px rgba(36, 33, 38, 0.09)',
        subtle: '0 1px 3px rgba(36, 33, 38, 0.05)',
      },
    },
  },
  plugins: [],
}
