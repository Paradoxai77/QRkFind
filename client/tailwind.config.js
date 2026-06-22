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
        // Positivus-inspired palette
        dark: '#191A23',
        lime: '#B9FF66',
        'lime-dark': '#a0e050',
        card: {
          dark: '#292A35',
          light: '#F3F3F3',
        },
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#B9FF66',
          500: '#B9FF66',
          600: '#a0e050',
          700: '#84cc16',
          800: '#65a30d',
          900: '#4d7c0f',
        },
        accent: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#B9FF66',
          500: '#B9FF66',
          600: '#a0e050',
        },
        warn: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        surface: '#191A23',
        ink: '#191A23',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 40px rgba(185,255,102,0.2)',
        'lime-glow': '0 0 30px rgba(185,255,102,0.4)',
        glow: '0 0 30px rgba(185,255,102,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
