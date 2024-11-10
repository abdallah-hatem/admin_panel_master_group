/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { prim: '#EA5740' },
    },
  },
  plugins: [
    // require('tailwindcss-animate'),

    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'red',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '6px',
            display: 'block',
          },
          '&::-webkit-scrollbar-track': {
            background: '#222222',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'white',
            borderRadius: '10px',
          },
        },
        '.scrollbar-webkit2': {
          '&::-webkit-scrollbar': {
            width: '6px',
            display: 'block',
          },
          '&::-webkit-scrollbar-track': {
            background: 'lightgray',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'black',
            borderRadius: '10px',
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
