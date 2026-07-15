/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        deep: '#0A1F1B',
        surface: '#12302A',
        surface2: '#17372F',
        border: '#234339',
        emerald: {
          DEFAULT: '#17C989',
          dim: '#0F9A69',
        },
        gold: {
          DEFAULT: '#D9A441',
          dim: '#B5842E',
        },
        rose: '#E85D5D',
        ink: '#EDF5F1',
        muted: '#8FA79D',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
