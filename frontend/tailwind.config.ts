/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#FCFAF7',
        ink: '#121211',
        muted: '#70706B',
        accent: {
          DEFAULT: '#265C45',
          soft: '#E6F0EA',
        },
        border: '#E8E8E1',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-newsreader)', 'serif'],
      },
      boxShadow: {
        premium: '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
      }
    },
  },
}
