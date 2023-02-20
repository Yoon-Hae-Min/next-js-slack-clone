/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './layouts/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: ({ theme }) => ({
        focusInput: '0 0 0 1px rgba(29,155,209,1), 0 0 0 5px rgba(29,155,209,0.3)',
        sm: `0 0 0 1px ${theme('colors.black[200]')}30`,
        md: `0 1px 1px 4px ${theme('colors.black.DEFAULT')}30`,
        lg: `0 4px 12px 0 ${theme('colors.black.DEFAULT')}30, 0 0 0 1px ${theme('colors.black.DEFAULT')}10`,
      }),
      colors: ({ theme }) => ({
        primary: {
          DEFAULT: '#4a154b',
          200: '#502551',
          250: '#522653',
          400: '#3f0e40',
        },
        error: {
          DEFAULT: '#e01e5a',
        },
        success: {
          DEFAULT: '#2eb67d',
        },
        white: {
          DEFAULT: '#ffffff',
          100: '#f8f8f8',
          150: '#dddddd',
          200: '#eeeeee',
        },
        blue: {
          100: '#1d9bd1',
          300: '#1264a3',
        },
        black: {
          DEFAULT: '#000000',
          200: '#1c1d1c',
        },
        gray: {
          200: '#868686',
          300: '#616061',
        },
      }),
    },
  },
  plugins: [],
};
