/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Rich Orange-Reddish Flame Gradient System
        flame: {
          50: '#fff5f2',
          100: '#ffe8e4',
          200: '#ffd4cc',
          300: '#ffb3a4',
          400: '#ff826b',
          500: '#f95738',
          600: '#ea3a18',
          700: '#c5280b',
          800: '#a2230c',
          900: '#852110',
          950: '#480c05',
          DEFAULT: '#f95738',
        },
        // Secondary: Light Purple / Soft Lilac
        lilac: {
          50: '#faf7ff',
          100: '#f3ebff',
          200: '#e8daff',
          300: '#d7beff',
          400: '#c196ff',
          500: '#a76eff',
          600: '#8e43fa',
          700: '#792fe1',
          800: '#6426bc',
          900: '#53219a',
          DEFAULT: '#e8daff',
        },
        // Accent: Seal Blue / Deep Navy Blue
        seal: {
          50: '#f0f5fa',
          100: '#dde8f2',
          200: '#bfd5e6',
          300: '#94bbd6',
          400: '#639cc1',
          500: '#3f80ab',
          600: '#2f6790',
          700: '#275275',
          800: '#142842',
          900: '#0c1e34', // Deep Seal Navy Blue
          950: '#071322',
          DEFAULT: '#0c1e34',
        },
        surface: {
          canvas: '#120402', // Deep dark canvas base
          card: '#0c1e34',   // Deep seal navy card surface
          cardSubtle: '#091626',
          border: 'rgba(232, 218, 255, 0.16)', // Lilac tinted subtle border
          borderHover: 'rgba(249, 87, 56, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'flame-gradient': 'linear-gradient(135deg, #f95738 0%, #ea3a18 50%, #c5280b 100%)',
        'flame-gradient-hover': 'linear-gradient(135deg, #ff6b4d 0%, #f94625 50%, #d42211 100%)',
        'canvas-gradient': 'radial-gradient(ellipse at 50% -10%, #4a1107 0%, #260804 40%, #120302 85%, #080101 100%)',
        'canvas-mesh': 'linear-gradient(155deg, #240703 0%, #3d0c05 28%, #561208 55%, #2a0904 80%, #0d0201 100%)',
        'card-navy': 'linear-gradient(180deg, rgba(12, 30, 52, 0.95) 0%, rgba(7, 19, 34, 0.95) 100%)',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'lifted': '0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3)',
        'flame': '0 4px 20px 0 rgba(249, 87, 56, 0.35)',
        'flame-lg': '0 8px 32px 0 rgba(249, 87, 56, 0.45)',
        'lilac': '0 4px 20px 0 rgba(232, 218, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
