/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        background: '#F7F4EE',      // Warm Ivory (Main page canvas)
        surface: {
          DEFAULT: '#FFFEFB',       // Soft White (Cards, modals, navigation)
          muted: '#EFE9DF',         // Sand Beige (Secondary panels, sub-sections)
        },
        border: {
          DEFAULT: '#E4DACE',       // Warm Border (Dividers, outlines)
          subtle: '#EDE5DB',
        },

        // Typography
        'text-primary': '#292A27',   // Charcoal (Main headings, prominent text)
        'text-secondary': '#716D66', // Warm Grey (Body copy, descriptions, captions)

        // Brand colors
        primary: {
          DEFAULT: '#C66A4A',       // Terracotta (Primary CTA, key active links)
          hover: '#A95338',         // Burnt Clay (Hover, active states)
          soft: '#EEDDD2',          // Soft Peach (Chips, highlights, tinted panels)
        },

        // Supporting & Semantic
        success: {
          DEFAULT: '#71836D',       // Muted Sage (Reciprocal indicator text, success)
          soft: '#E5EDE4',          // Pale Sage (Success badges, reciprocal cards)
        },
        rating: '#D6A75D',           // Muted Gold (Ratings, stars)

        // Semantic alerts
        warning: {
          DEFAULT: '#C66A4A',
          soft: '#EEDDD2',
        },
        danger: {
          DEFAULT: '#A95338',
          soft: '#FDF2F0',
          border: '#F2C4BC',
        },

        // Backward compatibility aliases mapping to the Warm Minimalist palette
        flame: {
          50: '#FDF7F4',
          100: '#EEDDD2',
          200: '#E2C8B8',
          300: '#D5A48F',
          400: '#C66A4A',
          500: '#C66A4A',
          600: '#A95338',
          700: '#8E452E',
          800: '#733725',
          900: '#5A2A1C',
          950: '#3D1A10',
          DEFAULT: '#C66A4A',
        },
        lilac: {
          50: '#FAF8F5',
          100: '#EFE9DF',
          200: '#E4DACE',
          300: '#D6CBC0',
          400: '#716D66',
          500: '#57544F',
          DEFAULT: '#716D66',
        },
        seal: {
          50: '#F7F4EE',
          100: '#EFE9DF',
          200: '#E4DACE',
          800: '#3A3B37',
          900: '#292A27',
          950: '#1E1F1C',
          DEFAULT: '#292A27',
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
        card: '0 4px 16px rgba(41, 42, 39, 0.05)',
        lifted: '0 8px 24px rgba(41, 42, 39, 0.08)',
        subtle: '0 1px 3px rgba(41, 42, 39, 0.04)',
      },
    },
  },
  plugins: [],
}
