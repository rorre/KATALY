module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1600px',
      },
      keyframes: {
        falling: {
          from: { top: '-300px', opacity: 0 },
          to: { top: 0, opacity: 1 },
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Source Sans Pro'],
        assistant: ['Assistant'],
      },
    },
  },
  plugins: [],
};
