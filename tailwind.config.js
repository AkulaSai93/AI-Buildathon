/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: 'rgba(255, 255, 255, 0.04)',
        border: 'rgba(255, 255, 255, 0.12)',
        'border-strong': 'rgba(124, 58, 237, 0.4)',
        violet: '#7c3aed',
        'violet-soft': '#a78bfa',
        cyan: '#06e5e5',
        magenta: '#ff2e97',
        orange: '#ff7a1a',
        'orange-soft': '#ffb14d',
        blue: '#2f6bff',
        'blue-soft': '#4fa8ff',
        red: '#e8000d',
        text: '#f4f4ff',
        'text-dim': '#9a9cb8',
        'text-dimmer': '#63647f',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        poster: ['var(--font-poster)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(90deg, #ffb14d, #06e5e5, #4fa8ff, #ffb14d)',
        'gradient-ribbon': 'linear-gradient(90deg, #ff7a1a 0%, #0a0a16 48%, #2f6bff 100%)',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: 1 },
          '51%, 100%': { opacity: 0 },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '300% 50%' },
        },
        'partners-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'mentors-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-378px * 4))' },
        },
        'mentors-grid-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'headline-marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'gradient-shift': 'gradient-shift 6s linear infinite',
        'partners-scroll': 'partners-scroll 26s linear infinite',
        'mentors-scroll': 'mentors-scroll 30s linear infinite',
        'mentors-grid-scroll': 'mentors-grid-scroll 40s linear infinite',
        'headline-marquee': 'headline-marquee 40s linear infinite',
      },
      spacing: {
        'header-h': '84px',
      },
    },
  },
  plugins: [],
};
