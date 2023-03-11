/** @type {import('tailwindcss').Config} */
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    // "./src/**/*.{js,ts,jsx,tsx}",
    // "./src/shared/components/**/*.{js,ts,jsx,tsx}",
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        login: '1f 1fr 1f',
      },
      colors: {
        blue: {
          10: '#EEF3FF',
          20: '#D1DEFF',
          30: '#A8C0FF',
          40: '#6993FF',
          50: '#3069FE',
          60: '#1252F7',
          70: '#0846E4',
        },
        red: {
          10: '#FDF2F2',
          20: '#F8D4D7',
          30: '#F8B0B4',
          40: '#F57F86',
          50: '#EC5962',
          60: '#D45058',
          70: '#C2434B',
        },
        green: {
          10: '#EBFAE2',
          20: '#D9F0CA',
          30: '#B3E494',
          40: '#85D355',
          50: '#68C132',
          60: '#57AD23',
          70: '#4F9C20',
        },
        orange: {
          10: '#FFF2E4',
          20: '#FFDDB9',
          30: '#FFC382',
          40: '#FFA849',
          50: '#FF921B',
          60: '#ED810C',
          70: '#D87407',
        },
        black: {
          DEFAULT: '#000000',
          00: '#FFFFFF',
          10: '#F3F3F5',
          15: '#ECECEC',
          20: '#E5E5E5',
          30: '#C0C0C0',
          40: '#A5A5A5',
          50: '#858585',
          60: '#6F6F6F',
          70: '#4A4A4A',
          80: '#333333',
          90: '#252525',
          100: '#1A1919',
        },
      },
    },
  },
  plugins: [],
};
