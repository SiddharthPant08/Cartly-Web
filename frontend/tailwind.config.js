/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF3FF',
          100: '#DCE7FF',
          200: '#B9CFFF',
          300: '#8FB0FF',
          400: '#5C87FA',
          500: '#3563EA',
          600: '#1D4ED8', // main brand blue
          700: '#1A3FB0',
          800: '#1A3487',
          900: '#1E3A8A',
          950: '#101E4A',
        },
        accent: {
          50: '#FFF4ED',
          100: '#FFE6D5',
          200: '#FEC9A3',
          300: '#FDA76B',
          400: '#FB8A3C',
          500: '#F97316', // main accent orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        surface: '#FFFFFF',
        canvas: '#F8FAFC',
        ink: {
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          300: '#CBD5E1',
          100: '#F1F5F9',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 16px -4px rgba(15, 23, 42, 0.08)',
        lift: '0 12px 32px -8px rgba(29, 78, 216, 0.25)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        fadeUp: 'fadeUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
