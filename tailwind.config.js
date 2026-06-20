/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        ivory: {
          50: '#FFFBF8',
          100: '#FFF9F5',
          200: '#FFF1E8',
        },
        rose: {
          50: '#FFF1F5',
          100: '#FFE4EC',
          200: '#FFC8DA',
          300: '#FFB6CE',
          400: '#FF87AB',
          500: '#FF6B9D',
          600: '#FF5C8E',
          700: '#D63384',
          800: '#A82468',
        },
        peach: {
          300: '#FFBFA3',
          400: '#FFA07A',
          500: '#FF8A5C',
        },
        warm: {
          50: '#FAF5F2',
          100: '#F5EDE8',
          400: '#B09386',
          500: '#8B7A7A',
          600: '#5C4A4A',
          700: '#3D2F2F',
        },
        heat: {
          0: '#F5EDE8',
          1: '#FFE4EC',
          2: '#FFB6CE',
          3: '#FF87AB',
          4: '#FF5C8E',
          5: '#D63384',
        },
        amber: {
          50: '#FFF8E1',
          100: '#FFECB3',
        }
      },
      boxShadow: {
        'card': '0 2px 12px rgba(214, 51, 132, 0.08)',
        'card-hover': '0 8px 24px rgba(214, 51, 132, 0.12)',
        'soft': '0 4px 20px rgba(255, 107, 157, 0.15)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
          '60%': { opacity: '1', transform: 'scale(1.02) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
