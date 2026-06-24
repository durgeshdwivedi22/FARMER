/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'farmer-green': '#2E7D32',
        'farmer-light': '#81C784',
        'farmer-dark': '#1B5E20',
        'farmer-brown': '#5D4037',
        'farmer-light-brown': '#8D6E63',
        'farmer-yellow': '#FBC02D',
        'farmer-orange': '#E65100',
        'farmer-blue': '#1976D2',
        'farmer-purple': '#7B1FA2',
        'farmer-red': '#D32F2F',
      },
      fontFamily: {
        'hindi': ['Noto Sans Devanagari', 'sans-serif'],
        'devanagari': ['Kohinoor Devanagari', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'farmer': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'farmer-lg': '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'farmer': '8px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
